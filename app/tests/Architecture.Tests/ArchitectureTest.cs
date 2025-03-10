using NetArchTest.Rules;
using System.Reflection;
using FluentAssertions;

namespace Architecture.Tests;

public class ArchitectureDependencyTest
{
    private const string DomainNamespace = "Server.Domain";
    private const string ApplicationNamespace = "Server.Application";
    private const string InfrastructureNamespace = "Server.Infrastructure";
    private const string GraphqlNamespace = "Server.GraphQL";

    [Fact]
    public void Domain_ShouldNot_HaveDepedencyOnOtherProjects()
    {
        var domainAssembly = Assembly.Load(DomainNamespace);
        Console.WriteLine("Assembly Full Name: " + domainAssembly.FullName);

        var otherProjects = new[] { ApplicationNamespace, InfrastructureNamespace, GraphqlNamespace };

        // Act
        var result = Types.InAssembly(domainAssembly)
            .ShouldNot()
            .HaveDependencyOnAny(otherProjects)
            .GetResult();

        // 
        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Infrastructure_Should_DependOnlyOnDomainAndApp()
    {
        var infraAssembly = Assembly.Load(InfrastructureNamespace);
        Console.WriteLine("Assembly Full Name: " + infraAssembly.FullName);

        var otherProjects = new[] { GraphqlNamespace };

        // Act
        var result = Types.InAssembly(infraAssembly)
            .ShouldNot()
            .HaveDependencyOnAll(otherProjects)
            .GetResult();

        // 
        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Graphql_Should_DependOnlyOnInfraAndApp()
    {
        var graphqlAssembly = Assembly.Load(GraphqlNamespace);
        Console.WriteLine("Assembly Full Name: " + graphqlAssembly.FullName);

        var otherProjects = new[] { DomainNamespace };

        // Act
        var result = Types.InAssembly(graphqlAssembly)
            .ShouldNot()
            .HaveDependencyOnAll(otherProjects)
            .GetResult();

        // 
        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Application_Should_DependOnlyOnDomain()
    {
        var applicationAssembly = Assembly.Load(ApplicationNamespace);
        Console.WriteLine("Assembly Full Name: " + applicationAssembly.FullName);

        var otherProjects = new[] { InfrastructureNamespace, GraphqlNamespace };

        // Act
        var result = Types.InAssembly(applicationAssembly)
            .ShouldNot()
            .HaveDependencyOnAll(otherProjects)
            .GetResult();

        // 
        result.IsSuccessful.Should().BeTrue();
    }
}