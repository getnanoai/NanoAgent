using FluentAssertions;
using Moq;
using NanoAgent.Application.Abstractions;
using NanoAgent.Application.Commands;
using NanoAgent.Application.Models;
using NanoAgent.Domain.Models;
using System.Collections.Generic;

namespace NanoAgent.Tests.Application.Commands;

public sealed class UpdateCommandHandlerTests
{
    [Fact]
    public async Task ExecuteAsync_Should_ReportCurrentVersion_When_NoUpdateIsAvailable()
    {
        ApplicationUpdateInfo updateInfo = new(
            "1.2.3",
            "1.2.3",
            new Uri("https://github.com/getnanoai/NanoAgent/releases/latest"),
            IsUpdateAvailable: false);

        Mock<IApplicationUpdateService> updateService = new(MockBehavior.Strict);
        updateService
            .Setup(service => service.CheckAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(updateInfo);

        Mock<IConfirmationPrompt> confirmationPrompt = new(MockBehavior.Strict);
        Mock<INanoAgentInstanceService> instanceService = new(MockBehavior.Strict);
        instanceService
            .Setup(service => service.GetOtherRunningInstancesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<RunningNanoAgentInstance>());
        Mock<IStatusMessageWriter> statusMessageWriter = new();
        UpdateCommandHandler sut = new(
            updateService.Object,
            confirmationPrompt.Object,
            statusMessageWriter.Object,
            instanceService.Object);

        ReplCommandResult result = await sut.ExecuteAsync(
            CreateContext(argumentText: string.Empty),
            CancellationToken.None);

        result.FeedbackKind.Should().Be(ReplFeedbackKind.Info);
        result.Message.Should().Be("NanoAgent is up to date. Current version: 1.2.3.");
        updateService.Verify(service => service.InstallAsync(It.IsAny<ApplicationUpdateInfo>(), It.IsAny<IProgress<string>>(), It.IsAny<CancellationToken>()), Times.Never);
        confirmationPrompt.VerifyNoOtherCalls();
        instanceService.Verify(service => service.GetOtherRunningInstancesAsync(It.IsAny<CancellationToken>()), Times.Never);
        instanceService.Verify(service => service.TerminateAsync(It.IsAny<RunningNanoAgentInstance>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_Should_InstallUpdate_When_NowArgumentIsUsed()
    {
        ApplicationUpdateInfo updateInfo = new(
            "1.2.3",
            "1.2.4",
            new Uri("https://github.com/getnanoai/NanoAgent/releases/latest"),
            IsUpdateAvailable: true);
        ApplicationUpdateInstallResult installResult = new(
            IsSuccess: true,
            "NanoAgent update installed: 1.2.4. Restart NanoAgent to use the new version.");

        Mock<IApplicationUpdateService> updateService = new(MockBehavior.Strict);
        updateService
            .Setup(service => service.CheckAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(updateInfo);
        updateService
            .Setup(service => service.InstallAsync(updateInfo, It.IsAny<IProgress<string>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(installResult);

        Mock<IConfirmationPrompt> confirmationPrompt = new(MockBehavior.Strict);
        Mock<INanoAgentInstanceService> instanceService = new(MockBehavior.Strict);
        instanceService
            .Setup(service => service.GetOtherRunningInstancesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<RunningNanoAgentInstance>());
        Mock<IStatusMessageWriter> statusMessageWriter = new();
        UpdateCommandHandler sut = new(
            updateService.Object,
            confirmationPrompt.Object,
            statusMessageWriter.Object,
            instanceService.Object);

        ReplCommandResult result = await sut.ExecuteAsync(
            CreateContext("now"),
            CancellationToken.None);

        result.FeedbackKind.Should().Be(ReplFeedbackKind.Info);
        result.Message.Should().Be(installResult.Message);
        updateService.VerifyAll();
        confirmationPrompt.VerifyNoOtherCalls();
        instanceService.Verify(service => service.GetOtherRunningInstancesAsync(It.IsAny<CancellationToken>()), Times.Once);
        instanceService.Verify(service => service.TerminateAsync(It.IsAny<RunningNanoAgentInstance>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_Should_SkipInstall_When_UserDeclinesPrompt()
    {
        ApplicationUpdateInfo updateInfo = new(
            "1.2.3",
            "1.2.4",
            new Uri("https://github.com/getnanoai/NanoAgent/releases/latest"),
            IsUpdateAvailable: true);

        Mock<IApplicationUpdateService> updateService = new(MockBehavior.Strict);
        updateService
            .Setup(service => service.CheckAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(updateInfo);

        Mock<IConfirmationPrompt> confirmationPrompt = new(MockBehavior.Strict);
        confirmationPrompt
            .Setup(prompt => prompt.PromptAsync(It.IsAny<ConfirmationPromptRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        Mock<INanoAgentInstanceService> instanceService = new(MockBehavior.Strict);
        instanceService
            .Setup(service => service.GetOtherRunningInstancesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<RunningNanoAgentInstance>());
        Mock<IStatusMessageWriter> statusMessageWriter = new();
        UpdateCommandHandler sut = new(
            updateService.Object,
            confirmationPrompt.Object,
            statusMessageWriter.Object,
            instanceService.Object);

        ReplCommandResult result = await sut.ExecuteAsync(
            CreateContext(argumentText: string.Empty),
            CancellationToken.None);

        result.FeedbackKind.Should().Be(ReplFeedbackKind.Info);
        result.Message.Should().Contain("Skipped NanoAgent 1.2.4.");
        updateService.Verify(service => service.InstallAsync(It.IsAny<ApplicationUpdateInfo>(), It.IsAny<IProgress<string>>(), It.IsAny<CancellationToken>()), Times.Never);
        confirmationPrompt.VerifyAll();
        instanceService.Verify(service => service.GetOtherRunningInstancesAsync(It.IsAny<CancellationToken>()), Times.Never);
        instanceService.Verify(service => service.TerminateAsync(It.IsAny<RunningNanoAgentInstance>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_Should_TerminateOtherInstances_When_UserConfirms()
    {
        ApplicationUpdateInfo updateInfo = new(
            "1.2.3",
            "1.2.4",
            new Uri("https://github.com/getnanoai/NanoAgent/releases/latest"),
            IsUpdateAvailable: true);
        ApplicationUpdateInstallResult installResult = new(
            IsSuccess: true,
            "NanoAgent update installed: 1.2.4. Restart NanoAgent to use the new version.");

        Mock<IApplicationUpdateService> updateService = new(MockBehavior.Strict);
        updateService
            .Setup(service => service.CheckAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(updateInfo);
        updateService
            .Setup(service => service.InstallAsync(updateInfo, It.IsAny<IProgress<string>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(installResult);

        Mock<IConfirmationPrompt> confirmationPrompt = new(MockBehavior.Strict);
        confirmationPrompt
            .Setup(prompt => prompt.PromptAsync(
                It.Is<ConfirmationPromptRequest>(request => request.Title.StartsWith("A NanoAgent update")),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        confirmationPrompt
            .Setup(prompt => prompt.PromptAsync(
                It.Is<ConfirmationPromptRequest>(request => request.Title.StartsWith("Other NanoAgent")),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        Mock<INanoAgentInstanceService> instanceService = new(MockBehavior.Strict);
        instanceService
            .Setup(service => service.GetOtherRunningInstancesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<RunningNanoAgentInstance> { new(4242, "nanoagent.exe") });
        instanceService
            .Setup(service => service.TerminateAsync(It.IsAny<RunningNanoAgentInstance>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        Mock<IStatusMessageWriter> statusMessageWriter = new();
        UpdateCommandHandler sut = new(
            updateService.Object,
            confirmationPrompt.Object,
            statusMessageWriter.Object,
            instanceService.Object);

        ReplCommandResult result = await sut.ExecuteAsync(
            CreateContext(argumentText: string.Empty),
            CancellationToken.None);

        result.FeedbackKind.Should().Be(ReplFeedbackKind.Info);
        result.Message.Should().Be(installResult.Message);
        instanceService.Verify(
            service => service.TerminateAsync(
                It.Is<RunningNanoAgentInstance>(instance => instance.ProcessId == 4242),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_Should_TerminateOtherInstancesAutomatically_When_NowArgumentUsed()
    {
        ApplicationUpdateInfo updateInfo = new(
            "1.2.3",
            "1.2.4",
            new Uri("https://github.com/getnanoai/NanoAgent/releases/latest"),
            IsUpdateAvailable: true);
        ApplicationUpdateInstallResult installResult = new(
            IsSuccess: true,
            "NanoAgent update installed: 1.2.4. Restart NanoAgent to use the new version.");

        Mock<IApplicationUpdateService> updateService = new(MockBehavior.Strict);
        updateService
            .Setup(service => service.CheckAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(updateInfo);
        updateService
            .Setup(service => service.InstallAsync(updateInfo, It.IsAny<IProgress<string>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(installResult);

        Mock<IConfirmationPrompt> confirmationPrompt = new(MockBehavior.Strict);
        Mock<INanoAgentInstanceService> instanceService = new(MockBehavior.Strict);
        instanceService
            .Setup(service => service.GetOtherRunningInstancesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<RunningNanoAgentInstance> { new(4242, "NanoAgent.CLI") });
        instanceService
            .Setup(service => service.TerminateAsync(It.IsAny<RunningNanoAgentInstance>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        Mock<IStatusMessageWriter> statusMessageWriter = new();
        UpdateCommandHandler sut = new(
            updateService.Object,
            confirmationPrompt.Object,
            statusMessageWriter.Object,
            instanceService.Object);

        ReplCommandResult result = await sut.ExecuteAsync(
            CreateContext("now"),
            CancellationToken.None);

        result.FeedbackKind.Should().Be(ReplFeedbackKind.Info);
        result.Message.Should().Be(installResult.Message);
        // No confirmation prompt is shown in 'now' mode; termination happens automatically.
        confirmationPrompt.VerifyNoOtherCalls();
        instanceService.Verify(
            service => service.TerminateAsync(
                It.Is<RunningNanoAgentInstance>(instance => instance.ProcessId == 4242),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_Should_SkipTermination_When_UserDeclines()
    {
        ApplicationUpdateInfo updateInfo = new(
            "1.2.3",
            "1.2.4",
            new Uri("https://github.com/getnanoai/NanoAgent/releases/latest"),
            IsUpdateAvailable: true);
        ApplicationUpdateInstallResult installResult = new(
            IsSuccess: true,
            "NanoAgent update installed: 1.2.4. Restart NanoAgent to use the new version.");

        Mock<IApplicationUpdateService> updateService = new(MockBehavior.Strict);
        updateService
            .Setup(service => service.CheckAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(updateInfo);
        updateService
            .Setup(service => service.InstallAsync(updateInfo, It.IsAny<IProgress<string>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(installResult);

        Mock<IConfirmationPrompt> confirmationPrompt = new(MockBehavior.Strict);
        confirmationPrompt
            .Setup(prompt => prompt.PromptAsync(
                It.Is<ConfirmationPromptRequest>(request => request.Title.StartsWith("A NanoAgent update")),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        confirmationPrompt
            .Setup(prompt => prompt.PromptAsync(
                It.Is<ConfirmationPromptRequest>(request => request.Title.StartsWith("Other NanoAgent")),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        Mock<INanoAgentInstanceService> instanceService = new(MockBehavior.Strict);
        instanceService
            .Setup(service => service.GetOtherRunningInstancesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<RunningNanoAgentInstance> { new(4242, "nanoagent.exe") });

        Mock<IStatusMessageWriter> statusMessageWriter = new();
        UpdateCommandHandler sut = new(
            updateService.Object,
            confirmationPrompt.Object,
            statusMessageWriter.Object,
            instanceService.Object);

        ReplCommandResult result = await sut.ExecuteAsync(
            CreateContext(argumentText: string.Empty),
            CancellationToken.None);

        result.FeedbackKind.Should().Be(ReplFeedbackKind.Info);
        result.Message.Should().Be(installResult.Message);
        instanceService.Verify(
            service => service.TerminateAsync(It.IsAny<RunningNanoAgentInstance>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    private static ReplCommandContext CreateContext(string argumentText)
    {
        ReplSessionContext session = new(
            new AgentProviderProfile(ProviderKind.OpenAi, BaseUrl: null),
            "gpt-4.1",
            ["gpt-4.1"]);

        string[] arguments = string.IsNullOrWhiteSpace(argumentText)
            ? []
            : argumentText.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        return new ReplCommandContext(
            "update",
            argumentText,
            arguments,
            string.IsNullOrWhiteSpace(argumentText) ? "/update" : $"/update {argumentText}",
            session);
    }
}
