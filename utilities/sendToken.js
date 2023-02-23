// Membuat token, menyimpannya di cookies
const sendToken = (user, statusCode, res) => {
  // Membuat token
  const token = user.getJwtToken();

  // Mengirim dan mentimpan token di cookie
  const options = {
    exppires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
module.exports = sendToken;
