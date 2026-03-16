// Hashing Algorithms

export const twoSumCode = `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        
        // Check if complement exists in map
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        
        // Add current number to map
        map[nums[i]] = i;
    }
    return {};
}`;

export function* twoSumGenerator(numsStr, targetStr) {
    const nums = numsStr.split(',').map(n => Number(n.trim()));
    const target = Number(targetStr);
    const map = {}; // val -> index
    
    yield {
        description: `Searching for two numbers that sum to ${target}`,
        hashingState: {
            nums,
            target,
            map: { ...map },
            activeIndex: -1,
            foundIndices: []
        },
        line: 1
    };

    for (let i = 0; i < nums.length; i++) {
        const val = nums[i];
        const complement = target - val;

        yield {
            description: `Index ${i}: Current value is ${val}. Seeking complement: ${target} - ${val} = ${complement}`,
            hashingState: {
                nums,
                target,
                map: { ...map },
                activeIndex: i,
                complement,
                foundIndices: []
            },
            line: 4
        };

        if (map[complement] !== undefined) {
            const foundIdx = map[complement];
            yield {
                description: `Found! ${complement} exists at index ${foundIdx}. ${complement} + ${val} = ${target}`,
                hashingState: {
                    nums,
                    target,
                    map: { ...map },
                    activeIndex: i,
                    foundIndices: [foundIdx, i]
                },
                line: 8
            };
            return;
        }

        map[val] = i;
        yield {
            description: `Complement not found. Adding ${val} to Hash Map at index ${i}.`,
            hashingState: {
                nums,
                target,
                map: { ...map },
                activeIndex: i,
                foundIndices: []
            },
            line: 12
        };
    }

    yield {
        description: "No two sum solution found.",
        hashingState: {
            nums,
            target,
            map: { ...map },
            activeIndex: -1,
            foundIndices: [],
            error: true
        },
        line: 14
    };
}
