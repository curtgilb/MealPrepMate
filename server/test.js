var rotate = function (nums, k) {
  const displaced = [];
  for (let i = 0; i < k; i++) {
    displaced.append(nums.pop());
  }
  nums.unshift(...displaced);
};
