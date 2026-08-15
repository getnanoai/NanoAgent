using System.Collections.Generic;

namespace NanoAgent.Application.Abstractions;

/// <summary>
/// Describes a running NanoAgent CLI process that is not the current session.
/// </summary>
public sealed record RunningNanoAgentInstance(
    int ProcessId,
    string ProcessName);

/// <summary>
/// Detects and terminates other running NanoAgent CLI sessions so an in-place
/// update can replace the currently executing binary without file-lock errors.
/// </summary>
public interface INanoAgentInstanceService
{
    /// <summary>
    /// Returns the running NanoAgent CLI instances other than the current process.
    /// Best-effort: an enumeration failure returns an empty list rather than throwing.
    /// </summary>
    Task<IReadOnlyList<RunningNanoAgentInstance>> GetOtherRunningInstancesAsync(
        CancellationToken cancellationToken);

    /// <summary>
    /// Terminates a single running instance. Best-effort: failures such as the
    /// target having already exited are swallowed so an update can proceed.
    /// </summary>
    Task TerminateAsync(RunningNanoAgentInstance instance, CancellationToken cancellationToken);
}
