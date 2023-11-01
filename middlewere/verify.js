const JWT=require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  //const token = req.body.token;
  const token= req.headers['access_token']
  if (!token){
      res.send("you are not allowed")
      return

  } 

  JWT.verify(token, process.env.JWT_kEY, (err,data) => {
    console.log("token",token)
    if (err) {
      // console.log(err)
    res.status(400).send("error occured")
      return
    }
    else
    req.data=data
    next();
  });
};

module.exports=verifyToken