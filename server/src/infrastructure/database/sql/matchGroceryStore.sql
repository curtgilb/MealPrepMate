WITH search_term AS (
  SELECT $1 AS term
)
SELECT
  i.*,
  similarity(i.name, st.term) AS match_score
FROM
  "GroceryStore" i
CROSS JOIN search_term st
WHERE
  similarity(i.name, st.term) > 0.3
ORDER BY match_score DESC
LIMIT $2;