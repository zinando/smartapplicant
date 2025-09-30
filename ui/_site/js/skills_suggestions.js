/**
 * Skills Suggestions javascript
*/

// Skill database organized by job titles
        const jobSkills = resumeSkillSuggestions;  // from input_suggestions.js

        // Common skills across many jobs
        const commonSkills = [
                                "Communication", "Problem Solving", "Teamwork", "Time Management", "Leadership",
                                "Critical Thinking", "Adaptability", "Creativity", "Decision Making", "Emotional Intelligence",
                                "Negotiation", "Conflict Resolution", "Active Listening", "Interpersonal Skills", "Public Speaking",
                                "Collaboration", "Stress Management", "Empathy", "Resilience", "Work Ethic",
                                "Self-Motivation", "Persuasion", "Accountability", "Delegation", "Attention to Detail",
                                "Strategic Thinking", "Coaching & Mentoring", "Innovation", "Flexibility", "Networking",
                                "Persuasive Writing", "Presentation Skills", "Organization", "Prioritization", "Multitasking",
                                "Patience", "Cultural Awareness", "Diplomacy", "Customer Service", "Professionalism",
                                "Integrity", "Reliability", "Research Skills", "Logical Reasoning", "Brainstorming",
                                "Goal Setting", "Process Improvement", "Analytical Skills", "Emotional Regulation", "Risk Management",
                                "Initiative", "Resource Management", "Feedback Handling", "Design Thinking", "Entrepreneurial Mindset",
                                "Innovation Management", "Change Management", "Positive Attitude", "Learning Agility", "Self-Awareness",
                                "Critical Observation", "Storytelling", "Writing Skills", "Digital Literacy", "Planning & Forecasting",
                                "Meeting Management", "Cross-functional Communication", "Rapport Building", "Influencing Others", "Crisis Management",
                                "Open-mindedness", "Self-Discipline", "Visionary Thinking", "Cooperation", "Collaboration Across Cultures",
                                "Mediation", "Assertiveness", "Curiosity", "Building Trust", "Conflict Handling",
                                "Problem Sensitivity", "Tolerance", "Composure", "Compassion", "Consensus Building",
                                "Reliability Under Pressure", "Diplomatic Communication", "Learning Mindset", "Sociability", "Mentoring Skills",
                                "Teaching Ability", "Constructive Criticism", "Relationship Management", "Encouragement", "Motivational Skills",
                                "Creativity in Expression", "Facilitation", "Humor", "Mindfulness", "Wellness Awareness",
                                "Ethical Judgment", "Fairness", "Honesty", "Transparency", "Humility",
                                "Active Participation", "Community Building", "Collaboration in Remote Teams", "Respect for Diversity", "Inclusiveness",
                                "Confidence", "Decision Support", "Effective Questioning", "Proactivity", "Diplomatic Leadership",
                                "Empowering Others", "Consensus Decision Making", "Group Facilitation", "Creative Brainstorming", "Constructive Feedback",
                                "Encouraging Innovation", "Intercultural Competence", "Sensitivity", "Negotiating Win-Win Solutions", "Openness to Feedback",
                                "Stress Tolerance", "Positive Influence", "Continuous Learning", "Knowledge Sharing", "Collaboration in Teams",
                                "Leadership Under Uncertainty", "Vision Communication", "Moral Responsibility", "Inspirational Speaking", "Non-verbal Communication",
                                "Articulation", "Story Crafting", "Conciseness", "Idea Presentation", "Technical Communication",
                                "Report Writing", "Documentation Skills", "Business Communication", "Listening Without Judgment", "Encouraging Participation",
                                "Group Decision Making", "Constructive Conflict Use", "Ethical Leadership", "Servant Leadership", "Situational Leadership",
                                "Facilitating Dialogue", "Consensus Seeking", "Change Agility", "Relationship Building", "Networking Events Participation",
                                "Self-Reflection", "Learning from Feedback", "Career Management", "Work-Life Balance", "Personal Accountability",
                                "Value Alignment", "Compromise", "Collaboration with Stakeholders", "Partnership Building", "Organizational Awareness",
                                "Policy Awareness", "Sustainability Awareness", "Social Responsibility", "Community Engagement", "Cross-Generational Communication",
                                "Global Mindset", "Virtual Collaboration", "Emotional Support", "Psychological Safety Awareness", "Trustworthiness",
                                "Reliability in Deadlines", "Focus Management", "Energy Management", "Prioritizing Effectively", "Agile Mindset",
                                "Scrum Collaboration", "Kanban Collaboration", "Agile Communication", "Lean Thinking", "Growth Mindset",
                                "Handling Ambiguity", "Situational Awareness", "Environmental Awareness", "Listening Empathetically", "Encouraging Diversity",
                                "Charisma", "Positive Reinforcement", "Story-based Persuasion", "Conflict Anticipation", "Boundary Setting",
                                "Self-Improvement", "Self-Organization", "Habit Formation", "Continuous Self-Development", "Critical Self-Reflection",
                                "Experimentation", "Learning by Doing", "Interdisciplinary Thinking", "Holistic Thinking", "Systematic Thinking",
                                "Conceptual Thinking", "Abstract Thinking", "Detail Orientation", "Big Picture Thinking", "Pattern Recognition",
                                "Problem Identification", "Root Cause Analysis", "Issue Framing", "Hypothesis Testing", "Scenario Planning",
                                "Forecasting", "Contingency Planning", "Foresight", "Opportunity Recognition", "Resourcefulness",
                                "Optimization Thinking", "Efficiency Awareness", "Process Orientation", "Improvisation", "Iterative Thinking",
                                "Design Orientation", "Aesthetic Sense", "Curatorial Skills", "Empowerment", "Human-Centered Thinking"
                            ];

        // Get all unique skills for when no job title is specified
        const getAllSkills = () => {
            const allSkills = new Set(commonSkills);
            Object.values(jobSkills).forEach(skills => {
                skills.forEach(skill => allSkills.add(skill));
            });
            return Array.from(allSkills).sort();
        };

        // DOM elements
        const desiredJobTitleInput = document.getElementById('desired-job-title');
        const desiredJobTitleSuggestions = document.getElementById('desired-job-title-suggestions');
        const skillInput = document.getElementById('skill-input');
        const skillTagsContainer = document.getElementById('skill-tags');
        const skillSuggestions = document.getElementById('skill-suggestions');
        const skillsInputContainer = document.getElementById('skills-input-container');

        // Track selected skills
        let selectedSkills = [];

        // Common job titles for suggestions
        const commonJobTitles = Object.keys(jobSkills);

        // Show job title suggestions
        desiredJobTitleInput.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            desiredJobTitleSuggestions.innerHTML = '';
            
            if (value) {
                const filteredTitles = commonJobTitles.filter(title => 
                    title.toLowerCase().includes(value)
                );
                
                if (filteredTitles.length > 0) {
                    filteredTitles.forEach(title => {
                        const div = document.createElement('div');
                        div.className = 'suggestion-item';
                        div.textContent = title;
                        div.addEventListener('click', () => {
                            desiredJobTitleInput.value = title;
                            desiredJobTitleSuggestions.classList.add('hidden');
                            updateSkillSuggestions();
                        });
                        desiredJobTitleSuggestions.appendChild(div);
                    });
                    desiredJobTitleSuggestions.classList.remove('hidden');
                } else {
                    desiredJobTitleSuggestions.classList.add('hidden');
                }
            } else {
                desiredJobTitleSuggestions.classList.add('hidden');
            }
        });

        // Update skill suggestions based on job title
        function updateSkillSuggestions() {
            const jobTitle = desiredJobTitleInput.value.toLowerCase();
            let skills = [];
            
            if (jobTitle && jobSkills[jobTitle]) {
                skills = jobSkills[jobTitle];
            } else {
                skills = getAllSkills();
            }
            
            // Filter out already selected skills
            skills = skills.filter(skill => !selectedSkills.includes(skill));
            // console.log('Updating skill suggestions for job title:', jobTitle, 'Skills:', skills);
            showSkillSuggestions(skills);
        }

        // Show skill suggestions
        function showSkillSuggestions(skills) {
            // console.log(skills);
            skillSuggestions.innerHTML = '';
            // console.log('Skill input focused, current value:', skills);
            if (skills.length > 0) {
                try {
                    skills.forEach(skill => {
                        const div = document.createElement('div');
                        div.className = 'suggestion-item flex justify-between items-center';
                        
                        const skillText = document.createElement('span');
                        skillText.textContent = skill;
                        skillText.addEventListener('click', (e) => {
                            e.stopPropagation();
                            addSkill(skill);
                        });
                        
                        // const addButton = document.createElement('button');
                        // addButton.className = 'text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded';
                        // addButton.textContent = 'Add';
                        // addButton.addEventListener('click', (e) => {
                        //     e.stopPropagation();
                        //     addSkill(skill);
                        // });
                        
                        div.appendChild(skillText);
                        // div.appendChild(addButton);
                        
                        div.addEventListener('click', () => {
                            addSkill(skill);
                        });
                        
                        skillSuggestions.appendChild(div);
                    });
                }
                catch (error) {
                    console.error('Error showing skill suggestions:', error);
                }
                // Position the suggestions container
                skillSuggestions.style.top = `${skillsInputContainer.offsetHeight}px`;
                skillSuggestions.style.left = "0";
                skillSuggestions.style.width = "100%";
                skillSuggestions.style.display = 'block';
                // void skillSuggestions.offsetHeight;
            } else {
                skillSuggestions.style.display = 'none';
            }
        }

        // Add a skill tag
        function addSkill(skill) {
            if (selectedSkills.includes(skill)) return;
            
            selectedSkills.push(skill);
            
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            
            const skillText = document.createElement('span');
            skillText.textContent = toTitleCase(skill);
            
            const removeButton = document.createElement('span');
            removeButton.className = 'skill-tag-remove';
            removeButton.innerHTML = '&times;';
            removeButton.addEventListener('click', () => {
                removeSkill(skill, skillTag);
            });
            
            skillTag.appendChild(skillText);
            skillTag.appendChild(removeButton);
            
            skillTagsContainer.appendChild(skillTag);
            
            // Clear input and update suggestions
            skillInput.value = '';
            updateSkillSuggestions();
        }

        // Remove a skill tag
        function removeSkill(skill, tagElement) {
            selectedSkills = selectedSkills.filter(s => s !== skill);
            skillTagsContainer.removeChild(tagElement);
            updateSkillSuggestions();
        }

        // Show suggestions while typing
        skillInput.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            let filteredSkills = [];
            const jobTitle = desiredJobTitleInput.value.toLowerCase();

            if (value) {
                // Filter by typed value
                if (jobTitle && jobSkills[jobTitle]) {
                    filteredSkills = jobSkills[jobTitle].filter(skill => 
                        skill.toLowerCase().includes(value) && !selectedSkills.includes(skill)
                    );
                } else {
                    filteredSkills = getAllSkills().filter(skill => 
                        skill.toLowerCase().includes(value) && !selectedSkills.includes(skill)
                    );
                }
            } else {
                // If input is empty, show all available skills
                if (jobTitle && jobSkills[jobTitle]) {
                    filteredSkills = jobSkills[jobTitle].filter(skill => 
                        !selectedSkills.includes(skill)
                    );
                } else {
                    filteredSkills = getAllSkills().filter(skill => 
                        !selectedSkills.includes(skill)
                    );
                }
            }
            // console.log('Skill input from input event:', this.value);
            showSkillSuggestions(filteredSkills);
        });

        // Show all suggestions on focus (even if input is empty)
        skillInput.addEventListener('focus', function() {
            let filteredSkills = [];
            const jobTitle = desiredJobTitleInput.value.toLowerCase();

            if (jobTitle && jobSkills[jobTitle]) {
                filteredSkills = jobSkills[jobTitle].filter(skill => 
                    !selectedSkills.includes(skill)
                );
            } else {
                filteredSkills = getAllSkills().filter(skill => 
                    !selectedSkills.includes(skill)
                );
            }
            // console.log('Filtered skills on focus:', filteredSkills);
            showSkillSuggestions(filteredSkills);
        });
        
        setupKeyboardNavigation(skillSuggestions, skillInput);

        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.suggestions-container') && 
                !e.target.matches('#desired-job-title, #skill-input')) {
                desiredJobTitleSuggestions.classList.add('hidden');
                skillSuggestions.style.display = 'none';
            }
        });

        // Initialize with all skills if no job title is specified
        // setTimeout(updateSkillSuggestions, 100);