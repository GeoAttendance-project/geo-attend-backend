export const catchAsyncNormal =
  (fn) =>
  (...args) =>
    fn(...args).catch((err) => {
      console.log(err);
      throw err;
    });
