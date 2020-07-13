module.exports = {
    /*  A helper function for asynchronous looping of arrays.
        https://gist.github.com/Atinux/fd2bcce63e44a7d3addddc166ce93fb2
    */
    asyncForEach: async (array, callback) => {
        for (let i = 0; i < array.length; i++) {
            await callback(array[i], i, array);
        }
    }
};