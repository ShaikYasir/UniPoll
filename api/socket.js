const { io } = require("../server/server");

module.exports = (req, res) => {
  if (req.method === "GET") {
    res.status(200).json({
      message: "Socket.IO server is running",
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
