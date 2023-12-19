import { max } from "class-validator";
import { Filtering } from "../decorators/filter.decorator";
import { FilterRule } from "../decorators/filter.decorator";


export const getFilters = (filters: Filtering[]): any => {
    let filterObject = {}

    filters.forEach((filter) => {

        if(!filter.rule) return

        if(filter.property == 'user'){
            filterObject = {
                ...filterObject,
                [filter.property]: filter.value
            }
            return;
        }

        if(filter.property == 'createdAt'){
            filterObject = {
                ...filterObject,
                $expr:{
                        $eq: [{$year: `$${filter.property}`}, filter.value]
                    
                }
            }
            return
        }

        if(filter.rule == FilterRule.EQUALS){
            filterObject = {
                ...filterObject,
                [filter.property]: {
                    $regex: filter.value,
                    $options: "i"
                }
            }
        }

        if(filter.rule == FilterRule.RANGE){

            let [minRange, maxRange]: number[] = filter?.value?.split(",").map(Number)
            
            if(!maxRange) maxRange = minRange

            filterObject = {
                ...filterObject,
                $or:[
                    {
                       $and:[
                            {experience: {$size:2}},
                            {
                                "experience.0": { $lte: minRange}
                            },
                            {
                                "experience.1": { $gte: maxRange}
                            }
                        ]
                    },
                    {
                        $and:[
                            {experience: {$size:1}},
                            {"experience.0": {$lte:maxRange}},
                            {"experience.0": {$gte:minRange}},
                        ]
                    }
                ]
                // $and:[
                //     {
                //         "experience.0": { $lte: minRange}
                //     },
                //     {
                //         "experience.1": { $gte: maxRange}
                //     }
                // ]
                
            }
        }

        if(filter.rule == FilterRule.ISNULL){
            filterObject = {
                ...filterObject,
                [filter.property]: null
            }
        }

    
        
    })
    
    return filterObject
}