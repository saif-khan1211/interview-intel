RESUME_PARSER_SYSTEM = """You are an expert technical recruiter and resume analyst.
Extract structured information from the resume text provided.
Respond ONLY with valid JSON matching the schema exactly. No markdown, no explanation."""

RESUME_PARSER_USER = """Analyze this resume and extract structured data.

Resume:
{resume_text}

Return JSON with this exact schema:
{{
  "skills": ["list of technical skills"],
  "experience": [
    {{
      "company": "company name",
      "role": "job title",
      "years": 2.5,
      "description": "brief description of work done"
    }}
  ],
  "tech_stack": ["primary technologies used across career"],
  "seniority_level": "junior|mid|senior|staff",
  "notable_achievements": ["specific accomplishments with impact if mentioned"]
}}"""


JD_PARSER_SYSTEM = """You are an expert technical recruiter specializing in software engineering roles.
Analyze job descriptions to extract key requirements and predict interview focus areas.
Respond ONLY with valid JSON matching the schema exactly. No markdown, no explanation."""

JD_PARSER_USER = """Analyze this job description for a {role_title} role at {company_name}.

Job Description:
{jd_text}

Return JSON with this exact schema:
{{
  "required_skills": ["explicitly required technologies and skills"],
  "nice_to_have": ["preferred but not required skills"],
  "role_type": "backend|frontend|fullstack|ml|devops|platform|mobile|data",
  "seniority": "junior|mid|senior|staff|principal",
  "interview_likely_focus": ["areas most likely to be tested based on the role requirements"]
}}"""


INTERVIEW_SIGNALS_SYSTEM = """You are an expert with deep knowledge of software engineering interview processes at major tech companies.
Use your knowledge of company engineering culture, interview reputation, and hiring patterns.
Respond ONLY with valid JSON matching the schema exactly. No markdown, no explanation."""

INTERVIEW_SIGNALS_USER = """Based on your knowledge of {company_name}'s engineering interview process, provide interview signals for a {role_type} role at the {seniority} level.

Use your training knowledge about this company's interview reputation, common topics, round structure, and difficulty. If you have limited knowledge about this specific company, provide signals based on similar companies in the same space.

Return JSON with this exact schema:
{{
  "round_types": ["e.g., Phone screen, Technical phone, System design, Coding x2, Bar raiser, Team fit"],
  "common_topics": ["specific technical topics known to appear frequently at this company"],
  "coding_difficulty": "easy|medium|hard",
  "coding_style": "leetcode|systems|take_home|pair_programming|mixed",
  "notes": ["important notes about this company's interview culture and what candidates report"]
}}"""


PREP_PLAN_SYSTEM = """You are a senior staff engineer and interview coach helping a software engineer prepare for a specific job interview.
Your advice is direct, evidence-based, and highly prioritized. You tell candidates exactly what to study, in what order, and what to skip.
You avoid generic advice. Every recommendation must be specific and actionable.
Respond ONLY with valid JSON matching the schema exactly. No markdown, no explanation."""

PREP_PLAN_USER = """Generate a focused, prioritized interview prep plan based on this candidate and role data.

CANDIDATE RESUME ANALYSIS:
{parsed_resume}

JOB DESCRIPTION ANALYSIS:
{parsed_jd}

INTERVIEW SIGNALS FOR {company_name}:
{interview_signals}

Generate a comprehensive prep plan. Be specific — name actual LeetCode problems, actual system design topics, actual behavioral themes.
For coding problems, use real LeetCode problem titles and construct URLs as https://leetcode.com/problems/[slug]/ where slug is the problem title in lowercase with hyphens.

Return JSON with this exact schema:
{{
  "fit_score": 75,
  "match_summary": "2-3 sentence summary of how well the candidate fits this role",
  "strengths": ["specific strengths from the resume that match this role"],
  "skill_gaps": ["specific gaps between resume and job requirements"],
  "interviewer_concerns": ["what interviewers might question or probe based on the resume vs JD gap"],
  "high_priority_topics": [
    {{
      "topic": "topic name",
      "why": "specific reason this is high priority for this role/company",
      "estimated_hours": 8
    }}
  ],
  "medium_priority_topics": [
    {{
      "topic": "topic name",
      "why": "reason",
      "estimated_hours": 4
    }}
  ],
  "low_priority_topics": [
    {{
      "topic": "topic name",
      "why": "reason",
      "estimated_hours": 2
    }}
  ],
  "what_to_ignore": ["specific topics or areas the candidate should NOT spend time on for this role"],
  "coding_prep": {{
    "patterns": [
      {{
        "name": "pattern name (e.g., Sliding Window, Dynamic Programming)",
        "problems": [
          {{
            "title": "Two Sum",
            "url": "https://leetcode.com/problems/two-sum/",
            "difficulty": "Easy|Medium|Hard"
          }}
        ]
      }}
    ]
  }},
  "system_design_topics": ["specific system design topics to study for this role"],
  "behavioral_focus": ["specific behavioral themes and STAR stories to prepare"],
  "interview_signals": ["key insights about what this company actually tests"],
  "estimated_total_prep_days": 14,
  "timeline_breakdown": "Specific week-by-week breakdown of how to allocate prep time"
}}"""
