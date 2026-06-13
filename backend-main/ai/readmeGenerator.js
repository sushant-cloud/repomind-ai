import { GoogleGenAI } from "@google/genai";

export const generateReadme = async (repoName, description, language) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return `# ${repoName}\n\n${description}\n\n## Technology Stack\n- Core Runtime: **${language}**\n- Ecosystem: Modern SaaS\n\n## Installation\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\n\n## License\nMIT license.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate a high-quality Markdown README file for a software project called "${repoName}". Description: "${description}". Primary stack: "${language}". Include standard sections: Overview, Installation, Usage, API, Contribution guide, and License.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    
    return response.text || "Failed to generate README content.";
  } catch (err) {
    return `# ${repoName}\n\n${description}\n\n*(AI README generation was offline: ${err.message})*`;
  }
};
