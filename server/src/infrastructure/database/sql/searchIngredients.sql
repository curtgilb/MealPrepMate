WITH search_term AS (
  SELECT $1 AS term
),
list_similarities AS (
  SELECT 
    t.id,
    MAX(similarity(unnested_name, st.term)) AS max_list_similarity
  FROM 
    "Ingredient" t,
    unnest(t."alternateNames") AS unnested_name,
    search_term st
  GROUP BY t.id
)
SELECT 
  t.*,
  GREATEST(
    similarity(t.name, st.term),
    COALESCE(l.max_list_similarity, 0)
  ) AS match_score
FROM 
  "Ingredient" t
CROSS JOIN search_term st
LEFT JOIN list_similarities l ON t.id = l.id
WHERE 
  similarity(t."name", st.term) > 0.3
  OR 
  EXISTS (
    SELECT 1 
    FROM unnest(t."alternateNames") list_item 
    WHERE similarity(list_item, st.term) > 0.3
  )
ORDER BY match_score DESC
LIMIT $2;