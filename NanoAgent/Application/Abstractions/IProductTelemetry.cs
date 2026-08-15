using NanoAgent.Application.Models;

namespace NanoAgent.Application.Abstractions;

public interface IProductTelemetry
{
    void TrackAppStarted();

    void TrackAppStopped();

    void TrackFeatureUsed(
        string featureName,
        string interactionKind,
        bool success,
        ConversationTurnMetrics? metrics = null,
        int attachmentCount = 0,
        Exception? exception = null);

    void TrackToolInvoked(
        string toolName,
        ToolResultStatus status,
        bool success,
        TimeSpan latency,
        string? errorMessage = null);

    void TrackProviderRequest(
        string? providerKind,
        bool success,
        TimeSpan latency,
        bool streamed,
        int retryCount,
        string? errorMessage = null);
}
