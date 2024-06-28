using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using WebServerService.Domain.Model;

namespace WebServerService.Domain.Utility
{
    public static class ExpressionBuilder
    {
        public static Expression<Func<T, bool>> BuildFilter<T>(IEnumerable<FilterCriterion>? filterCriteria)
        {
            // Initialize the predicate to true
            Expression<Func<T, bool>> predicate = entity => true;

            if (filterCriteria == null || !filterCriteria.Any())
            {
                return predicate;
            }

            var parameter = Expression.Parameter(typeof(T), "entity");

            foreach (var criterion in filterCriteria)
            {
                var property = Expression.Property(parameter, criterion.Column);

                if (property != null)
                {
                    Expression comparisonExpression;
                    var propertyType = property.Type;

                    if (propertyType == typeof(Guid))
                    {
                        var value = Expression.Constant(Guid.Parse(criterion.Value), typeof(Guid));
                        comparisonExpression = Expression.Equal(property, value);
                    }
                    else if (propertyType == typeof(DateTime))
                    {
                        var value = Expression.Constant(DateTime.Parse(criterion.Value), typeof(DateTime));
                        comparisonExpression = Expression.Equal(property, value);
                    }
                    else if (propertyType == typeof(string))
                    {
                        var value = Expression.Constant(criterion.Value, typeof(string));
                        var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                        comparisonExpression = Expression.Call(property, containsMethod, value);
                    }
                    else
                    {
                        var value = Expression.Constant(Convert.ChangeType(criterion.Value, propertyType));
                        comparisonExpression = Expression.Equal(property, value);
                    }

                    if (comparisonExpression != null)
                    {
                        var lambda = Expression.Lambda<Func<T, bool>>(comparisonExpression, parameter);
                        predicate = predicate.And(lambda);
                    }
                }
            }

            return predicate;
        }

        // Utility method to combine predicates using AND
        private static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> expr1, Expression<Func<T, bool>> expr2)
        {
            var parameter = Expression.Parameter(typeof(T));

            var visitor = new ReplacingExpressionVisitor();
            visitor.Add(expr1.Parameters[0], parameter);
            visitor.Add(expr2.Parameters[0], parameter);

            var combined = visitor.Visit(Expression.AndAlso(expr1.Body, expr2.Body));

            return Expression.Lambda<Func<T, bool>>(combined, parameter);
        }

        private class ReplacingExpressionVisitor : ExpressionVisitor
        {
            private readonly Dictionary<Expression, Expression> _replacements = new Dictionary<Expression, Expression>();

            public void Add(Expression original, Expression replacement)
            {
                _replacements[original] = replacement;
            }

            protected override Expression VisitParameter(ParameterExpression node)
            {
                if (_replacements.TryGetValue(node, out var replacement))
                {
                    return replacement;
                }

                return node;
            }
        }
    }
}
