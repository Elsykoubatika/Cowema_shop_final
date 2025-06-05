
// Générateur de codes promotionnels
export const generatePromotionCodes = (count: number, options: {
  prefix?: string;
  length?: number;
  includeNumbers?: boolean;
  includeLetters?: boolean;
}): string[] => {
  const {
    prefix = 'PROMO',
    length = 8,
    includeNumbers = true,
    includeLetters = true
  } = options;
  
  const codes: string[] = [];
  const characters = [
    ...(includeLetters ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : ''),
    ...(includeNumbers ? '23456789' : '')
  ].filter(Boolean).join('');
  
  // Exclure les caractères ambigus comme O/0, I/1
  
  for (let i = 0; i < count; i++) {
    let code = prefix;
    
    // Générer la partie aléatoire du code
    for (let j = 0; j < length; j++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    
    codes.push(code);
  }
  
  return codes;
};
