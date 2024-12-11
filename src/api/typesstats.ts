import axios from 'axios';
import { Request, Response } from 'express';
import { SampleData } from './types';

const DATA_URL = 'https://sampleapi.squaredup.com/integrations/v1/service-desk?datapoints=500';

// function to calculate percetange of individual types
function typePercentage(results: { type: String}[], type: string ): number {
    let count = 0;

    for (let i = 0; i < results.length; i++) {
        if (results[i].type == type) {
            count++;
        }
    }

    const percentage = ( count / results.length) * 100;
    return Number(percentage.toFixed(2));
}

export const GET = async (req: Request, res: Response) => {
    const { data } = await axios.get<SampleData>(DATA_URL)
    const problem = typePercentage(data.results, "problem")
    const question = typePercentage(data.results, "question")
    const task = typePercentage(data.results, "task")
    res.json({ "Types percentages":  
        { problem, question, task }
     });
};
