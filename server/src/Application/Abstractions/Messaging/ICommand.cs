using MediatR;
using Server.Domain.Abstractions.Result;

namespace Server.Application.Abstractions.Messaging;

// One that just returns a result without a result
public interface ICommand : IRequest<Result>, IBaseCommand;

// One that returns a result
public interface ICommand<TResponse> : IRequest<Result<TResponse>>, IBaseCommand;

public interface IBaseCommand;