import axios from 'axios';
import { Request, Response } from 'express';
import { SampleData } from './types';

const DATA_URL = 'https://sampleapi.squaredup.com/integrations/v1/service-desk?datapoints=500';

// function to calculate percetange of individual priority
function typePercentage(results: { priority: String}[], priority: string ): number {
    let count = 0;

    for (let i = 0; i < results.length; i++) {
        if (results[i].priority == priority) {
            count++;
        }
    }

    const percentage = ( count / results.length) * 100;
    return Number(percentage.toFixed(2));
}

export const GET = async (req: Request, res: Response) => {
    const { data } = await axios.get<SampleData>(DATA_URL)
    const high = typePercentage(data.results, "high")
    const medium = typePercentage(data.results, "medium")
    const low = typePercentage(data.results, "low")
    res.json({ "Priority percentages":  
        { high, medium, low }
     });
};
