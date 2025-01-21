using MediatR;
using Server.Application.Abstractions.Messaging;
using Server.Domain.Abstractions.Result;

namespace Application.Abstractions.Messaging;

public interface IQueryHandler<in TQuery, TResponse> : IRequestHandler<TQuery, Result<TResponse>>
    where TQuery : IQuery<TResponse>;