var twoSum = function(nums, target) {
    let map = {}
    for(let i=0;i<nums.length-1;i++){
        let complement = nums[i] - target;
        if(complement in map){
            return [map[complement],i-1]
        }
        else{
            map[nums[i]] = i
        }
    }
};

twoSum([3,2,4],6)