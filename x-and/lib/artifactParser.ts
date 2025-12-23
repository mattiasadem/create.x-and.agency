
export interface XandFile {
  path: string;
  content: string;
}

export interface XandImage {
  path: string;
  prompt: string;
}

export interface XandArtifact {
  id: string;
  title: string;
  files: XandFile[];
  images: XandImage[];
  plan: string[];
}

export function parseArtifacts(response: string): XandArtifact | null {
  // 1. Extract the main artifact block
  // Use a more permissive regex that handles attributes in any order and optional quotes
  const artifactRegex = /<xandArtifact\s+(?:id="([^"]*)"\s+)?(?:title="([^"]*)"\s*)?>([\s\S]*?)<\/xandArtifact>/;
  const match = artifactRegex.exec(response);

  if (!match) return null;

  const id = match[1] || 'generated-artifact';
  const title = match[2] || 'Generated App';
  const content = match[3];

  const files: XandFile[] = [];
  const images: XandImage[] = [];
  const plan: string[] = [];

  // 2. Extract files
  // Handle optional quotes around filePath and potential spaces
  const fileRegex = /<xandAction\s+type="file"\s+filePath=["']?([^"']+)["']?>([\s\S]*?)<\/xandAction>/g;
  let fileMatch;
  while ((fileMatch = fileRegex.exec(content)) !== null) {
    let fileContent = fileMatch[2].trim();
    
    // Strip CDATA if present. 
    const cdataStart = '<![' + 'CDATA[';
    const cdataEnd = ']]' + '>';
    
    if (fileContent.startsWith(cdataStart)) {
      fileContent = fileContent.substring(cdataStart.length);
      if (fileContent.endsWith(cdataEnd)) {
        fileContent = fileContent.substring(0, fileContent.length - cdataEnd.length);
      }
    }
    
    files.push({
      path: fileMatch[1],
      content: fileContent.trim(),
    });
  }

  // 3. Extract images
  const imageRegex = /<xandAction\s+type="image"\s+filePath=["']?([^"']+)["']?>\s*([\s\S]*?)\s*<\/xandAction>/g;
  let imageMatch;
  while ((imageMatch = imageRegex.exec(content)) !== null) {
    images.push({
      path: imageMatch[1],
      prompt: imageMatch[2].trim(),
    });
  }

  // 4. Extract plan
  const planRegex = /<xandAction\s+type="plan">([\s\S]*?)<\/xandAction>/;
  const planMatch = planRegex.exec(content);
  if (planMatch) {
    const planText = planMatch[1].trim();
    planText.split('\n').forEach(line => {
      const cleaned = line.replace(/^[\s-]*\*/, '').replace(/^-/, '').trim();
      if (cleaned) plan.push(cleaned);
    });
  }

  return {
    id,
    title,
    files,
    images,
    plan
  };
}
