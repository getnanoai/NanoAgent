using FluentAssertions;
using NanoAgent.Application.Abstractions;
using NanoAgent.Infrastructure.Updates;
using NanoAgent.Infrastructure.Secrets;
using NanoAgent.Tests.Infrastructure.Secrets.TestDoubles;
using System.Collections.Generic;
using Xunit;

namespace NanoAgent.Tests.Infrastructure.Updates;

public sealed class NanoAgentInstanceServiceTests
{
    [Theory]
    [InlineData("nanoagent", true)]
    [InlineData("NanoAgent.CLI", true)]
    [InlineData("nanoagent.exe", true)]
    [InlineData("NANOAGENT.EXE", true)]
    [InlineData("dotnet", false)]
    [InlineData("node", false)]
    [InlineData("", false)]
    [InlineData(null, false)]
    public void MatchesNanoAgentName_Should_RecognizeNanoAgentBinaries(string? name, bool expected)
    {
        NanoAgentInstanceService.MatchesNanoAgentName(name!).Should().Be(expected);
    }

    [Fact]
    public void ParseWindowsLine_Should_ExcludeCurrentProcessAndNonNanoAgent()
    {
        int current = 5678;

        NanoAgentInstanceService
            .ParseWindowsLine("\"nanoagent.exe\",\"1234\",\"Services\",\"0\",\"12,345 K\"", current)
            .Should().Be(new RunningNanoAgentInstance(1234, "nanoagent.exe"));

        NanoAgentInstanceService
            .ParseWindowsLine("\"dotnet.exe\",\"4321\",\"Console\",\"1\",\"1 K\"", current)
            .Should().BeNull();

        // The current session must never be flagged as an "other" instance.
        NanoAgentInstanceService
            .ParseWindowsLine($"\"nanoagent.exe\",\"{current}\",\"Console\",\"1\",\"1 K\"", current)
            .Should().BeNull();
    }

    [Fact]
    public void ParsePosixLine_Should_SkipHeaderAndExcludeNonNanoAgent()
    {
        int current = 5678;

        NanoAgentInstanceService.ParsePosixLine("  PID COMM", current).Should().BeNull();

        NanoAgentInstanceService
            .ParsePosixLine(" 1234 NanoAgent.CLI", current)
            .Should().Be(new RunningNanoAgentInstance(1234, "NanoAgent.CLI"));

        NanoAgentInstanceService
            .ParsePosixLine(" 4321 dotnet", current)
            .Should().BeNull();

        NanoAgentInstanceService
            .ParsePosixLine($" {current} nanoagent", current)
            .Should().BeNull();
    }

    [Fact]
    public async Task GetOtherRunningInstancesAsync_Should_RunEnumerationCommandAndFilterNanoAgent()
    {
        FakeProcessRunner processRunner = new();
        string output = OperatingSystem.IsWindows()
            ? "\"nanoagent.exe\",\"1234\",\"Services\",\"0\",\"12,345 K\"\r\n\"dotnet.exe\",\"5678\",\"Console\",\"1\",\"45,678 K\"\r\n"
            : "  PID COMM\n 1234 NanoAgent.CLI\n 5678 dotnet\n";
        processRunner.EnqueueResult(new ProcessExecutionResult(0, output, string.Empty));

        NanoAgentInstanceService sut = new(processRunner);

        IReadOnlyList<RunningNanoAgentInstance> instances = await sut.GetOtherRunningInstancesAsync(
            CancellationToken.None);

        instances.Should().ContainSingle(
            instance => instance.ProcessId == 1234 &&
                        instance.ProcessName.Contains("nanoagent", StringComparison.OrdinalIgnoreCase));
        instances.Should().NotContain(
            instance => instance.ProcessName.Contains("dotnet", StringComparison.OrdinalIgnoreCase));

        ProcessExecutionRequest request = processRunner.Requests.Should().ContainSingle().Subject;
        request.FileName.Should().Be(OperatingSystem.IsWindows() ? "tasklist" : "ps");
    }

    [Fact]
    public async Task TerminateAsync_Should_RunPlatformKillCommandForTarget()
    {
        FakeProcessRunner processRunner = new();
        processRunner.EnqueueResult(new ProcessExecutionResult(0, string.Empty, string.Empty));

        NanoAgentInstanceService sut = new(processRunner);
        await sut.TerminateAsync(new RunningNanoAgentInstance(1234, "nanoagent.exe"), CancellationToken.None);

        ProcessExecutionRequest request = processRunner.Requests.Should().ContainSingle().Subject;
        request.FileName.Should().Be(OperatingSystem.IsWindows() ? "taskkill" : "kill");
        request.Arguments.Should().Contain("1234");
    }
}
