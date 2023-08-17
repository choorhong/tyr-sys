----------------------- SETION 1: PROPSED SOLUTIONS -------------------------

-- Below are some of the solutions to improve query performance and/or codes readabilty for future maintenance, they might include the following: 

-- Indexes: Ensure that the columns used in JOIN conditions and WHERE clauses are properly indexed. Indexes can significantly improve query performance by allowing the database to quickly locate relevant rows.
-- Query Rewriting: Rewrite the query to avoid repeated patterns. Commom patterns are common table expression (CTE), temp table, and subquery to simplify parts of the query.
-- Subqueries vs. Joins: Alhough JOINs are preferred over subqueries. However, sparing usage of subqueries might reduce the complexity of the relationships, thus yield better performances than OUTER JOINs in some cases.
-- Reduce LIKE/ILIKE Wildcards: Using leading wildcards in LIKE/ILIKE statements (e.g., '%キャビンアテンダント%') can make indexing less effective. If possible, prefer concise text search over leading wildcards.
-- Query Simplification: Simplify the query by removing unnecessary fields from the SELECT clause. Only select the columns needed to reduce the amount of data retrieved.
-- Normalization: Ensure that the database schema is properly normalized by breaking down data into smaller, related tables to reduce redundancy. This can improve query efficiency by reducing the amount of data that needs to be processed.
-- Denormalization: Denormalizing certain data might improve query performance by reduce redundancy to make data retrieval faster and thus reduce JOIN operations. E.g: combine job_categories and job_types into a single table by adding "category" of an enum type column to job_types.
-- Use EXISTS: EXISTS clause can be more efficient than LEFT JOINs, especially at cases to verify the existence of related records.
-- Database Optimization: Regularly analyze and optimize the database, including reorganizing indexes, updating statistics, and performing regular maintenance tasks.
-- Profiling and Explain Plans: Use database tools like SQL Sentry or SSMS to analyze the execution plan of the query and further identify bottlenecks and areas for optimization.

-- My improvement suggestion in section 3 includes some of the proposed solutions above and they are tested in Postgres env. 

-----------------------------------------------------------------------------
--------- SETION 2: EXISTING QUERY BREAKDOWN & DB UNDERSTANDING -------------

-- There were 14 tables used in the query, they are:
-- Table 1: Jobs (main table)
-- Table 2: Personalities
-- Table 2b: JobsPersonalities (junction table between table 1 & 2)
-- Table 4: PracticalSkills 
-- Table 5b: JobsPracticalSkills (junction table between table 1 & 4)
-- Table 6: BasicAbilities
-- Table 7b: JobsBasicAbilities (junction table between table 1 & 6)
-- Table 8: affiliates 
-- Table 9b: JobTools (junction table between table 1 & 8 affiliate.types = 1 as Tools)
-- Table 10b: JobsCareerPaths (junction table between table 1 & 8 affiliate.types = 3 as CareerPaths)
-- Table 11b:JobsRecQualifications (junction table between table 1 & 8 affiliate.types = 3 as RecQualifications)
-- Table 12b: JobsReqQualifications (junction table between table 1 & 8 affiliate.types = 3 as ReqQualifications)
-- Table 13a: JobCategories (1M - JobCategories.id = Jobs.job_category_id)
-- Table 14a: JobTypes (1M - JobTypes.id = Jobs.job_type_id)

-- ps: Table with b suffix indicates junction table
-- ps: Table with a suffix indicates table with one-to-one (11) or one-to-many (1M) relationship with jobs (main table)

-----------------------------------------------------------------------------
-------------- SETION 3: IMPROVEMENT SUGGESTION (IN POSTGRES)----------------

-- Construct a CTE for 'jobs' table named FilteredJobs with combination from its one-to-one or one-to-many constraints column
-- and filtered conditions in WHERE clause
WITH FilteredJobs AS (
    SELECT 
	    j.*,
	    jc.id AS "JobCategories__id",
	    jc.name AS "JobCategories__name",
	    jc.sort_order AS "JobCategories__sort_order",
		jc.created_by AS "JobCategories__created_by",
		jc.created AS "JobCategories__created",
		jc.modified AS "JobCategories__modified",
		jc.deleted AS "JobCategories__deleted",
		jt.id AS "JobTypes__id",
		jt.name AS "JobTypes__name",
	    jt.job_category_id AS "JobTypes__job_category_id",
	    jt.sort_order AS "JobTypes__sort_order",
	    jt.created_by AS "JobTypes__created_by",
	    jt.created AS "JobTypes__created",
	    jt.modified AS "JobTypes__modified",
	    jt.deleted AS "JobTypes__deleted"
    FROM 
    	jobs j
    	JOIN job_categories jc ON j.job_category_id = jc.id AND (jc.deleted) IS NULL
    	JOIN job_types jt ON j.job_type_id = jt.id AND (jt.deleted) IS NULL
    WHERE
        (j.name || description || detail || business_skill || knowledge ||
        location || activity || salary_statistic_group || salary_range_remarks ||
        restriction || remarks) ILIKE '%キャビンアテンダント%'
        AND publish_status = TRUE
        AND j.deleted IS NULL
),
-- Construct a CTE based on the many-to-many relationship of 'jobs' table.
RelatedData AS (
    SELECT
        jp.job_id,
        string_agg(DISTINCT p.name, ', ') AS personality_names,
        string_agg(DISTINCT ps.name, ', ') AS practical_skill_names,
        string_agg(DISTINCT ba.name, ', ') AS basic_ability_names,
        string_agg(DISTINCT t.name, ', ') AS tool_names,
        string_agg(DISTINCT cp.name, ', ') AS career_path_names,
        string_agg(DISTINCT rc.name, ', ') AS rec_qualification_names,
        string_agg(DISTINCT rq.name, ', ') AS req_qualification_names
    FROM
        jobs_personalities jp
        LEFT JOIN personalities p ON jp.personality_id = p.id AND p.deleted IS NULL
        
        LEFT JOIN jobs_practical_skills jps ON jp.job_id = jps.job_id
        LEFT JOIN practical_skills ps ON jps.practical_skill_id = ps.id AND ps.deleted IS NULL
        
        LEFT JOIN jobs_basic_abilities jba ON jp.job_id = jba.job_id
        LEFT JOIN basic_abilities ba ON jba.basic_ability_id = ba.id AND ba.deleted IS NULL
        
        LEFT JOIN jobs_tools jt ON jp.job_id = jt.job_id
        LEFT JOIN affiliates t ON jt.affiliate_id = t.id AND t.type = 1 AND t.deleted IS NULL
        
        LEFT JOIN jobs_career_paths jcp ON jp.job_id = jcp.job_id
        LEFT JOIN affiliates cp ON jcp.affiliate_id = cp.id AND cp.type = 3 AND cp.deleted IS NULL
        
        LEFT JOIN jobs_rec_qualifications jcq ON jp.job_id = jcq.job_id
        LEFT JOIN affiliates rc ON jcq.affiliate_id = rc.id AND rc.type = 2 AND rc.deleted IS NULL
        
        LEFT JOIN jobs_req_qualifications jqq ON jp.job_id = jqq.job_id
        LEFT JOIN affiliates rq ON jqq.affiliate_id = rq.id AND rq.type = 2 AND rq.deleted IS NULL

    -- Brief subquery to establish the linkage between FilteredJobs CTE and RelatedData CTE
    WHERE jp.job_id IN (SELECT FilteredJobs.id FROM FilteredJobs)
    GROUP BY jp.job_id
)

-- Construct final query based on the 2 CTE tables
SELECT
    fj.*
FROM
    FilteredJobs fj
    LEFT JOIN RelatedData rd ON fj.id = rd.job_id
ORDER BY
    fj.sort_order DESC,
    fj.id DESC
LIMIT 50 OFFSET 0;

