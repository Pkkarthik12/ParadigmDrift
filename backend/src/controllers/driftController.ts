import { Request, Response } from 'express';
import { generateAnalogy } from '../services/aiService.js';

export const getDriftAnalogy = async (req: Request, res: Response) => {
  try {
    const { problem } = req.body;

    if (!problem || typeof problem !== 'string') {
      return res.status(400).json({ error: 'A valid problem description is required' });
    }

    const analogy = await generateAnalogy(problem);
    
    return res.status(200).json(analogy);
  } catch (error: any) {
    console.error('Drift Controller Error:', error);
    return res.status(500).json({ 
      error: 'The engine failed to pivot. Please try again.',
      details: error.message 
    });
  }
};
