import axios from 'axios';
import { Request, Response } from 'express';
import { SampleData } from './types';

const DATA_URL = 'https://sampleapi.squaredup.com/integrations/v1/service-desk?datapoints=500';

// retrieve tickets using staff_id
function getTicketByStaffName(
    results: { id: number; created: string; updated: string; priority: string;
         status: string; assignee_id: string}[], 
         assignee_id: string, 
): { matchedResults: { id: number; created: string; updated: string; 
    priority:string, status: string; assignee_id: string }[] } {
    const matchedResults: { id: number; created: string; updated: string; priority:string; 
        status: string, assignee_id: string }[] = [];

    for (let i = 0; i < results.length; i++) {
        if (results[i].assignee_id == assignee_id) {
            matchedResults.push({
                id: results[i].id,
                created: results[i].created,
                updated: results[i].updated,
                priority: results[i].priority,
                status: results[i].status, 
                assignee_id: results[i].assignee_id,
              });
        }
    }
    return { matchedResults };
}

// calc total number of individual priorities
function countPriority(
    results: { id: number; created: string; updated: string; priority: string; 
        status: string; assignee_id: string}[]
): {high: number; normal: number; low: number} {
    let high = 0;
    let normal= 0;
    let low = 0;

    for (let i = 0; i < results.length; i++) {
        if (results[i].priority == "high") {
            high += 1;
        } else if (results[i].priority == "normal") {
            normal += 1;
        } else {
            low += 1;
        }
    }

    return { high, normal, low };
}

export const GET = async (req: Request, res: Response) => {
    const { data } = await axios.get<SampleData>(DATA_URL)
    const { matchedResults } = getTicketByStaffName(data.results, "Frank");
    const priorityCounts = countPriority(matchedResults);
    res.json({ matchedResults, priorityCounts });
};
