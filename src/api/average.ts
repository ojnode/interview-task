import axios from 'axios';
import { Request, Response } from 'express';
import { SampleData } from './types';

const DATA_URL = 'https://sampleapi.squaredup.com/integrations/v1/service-desk?datapoints=500';

// filter and return high-priority and solved issues with their ids
function highPrioritySolved(
    results: { id: number; created: string; updated: string; priority: string; status: string }[], 
    priority: string, 
    status: string 
): { matchedResults: { id: number; created: string; updated: string }[] } {
    const matchedResults: { id: number; created: string; updated: string }[] = [];

    for (let i = 0; i < results.length; i++) {
        if (results[i].priority == priority && results[i].status == status) {
            matchedResults.push({
                id: results[i].id,
                created: results[i].created,
                updated: results[i].updated,
              });
        }
    }
    return { matchedResults };
}

function findAverage( matchedResults: { created: string; updated: string }[] ) {
    let totalTime = 0;

    for (let i = 0; i < matchedResults.length; i++) {
        const createdTime = new Date(matchedResults[i].created).getTime();
        const updatedTime = new Date(matchedResults[i].updated).getTime();
        const diff = updatedTime - createdTime;
        const mins = diff / (1000 * 60); // convert to min
        totalTime += mins;
    }
    return totalTime / matchedResults.length;
}

export const GET = async (req: Request, res: Response) => {
    const { data } = await axios.get<SampleData>(DATA_URL)
    const { matchedResults } = highPrioritySolved(data.results, "high", "solved")
    const averageTimeMins = findAverage(matchedResults)
    res.json({ averageTimeMins });
};
