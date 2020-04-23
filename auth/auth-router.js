const bcrypt = require("bcryptjs");

const router = require("express").Router();
const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);

  user.password = hash;

  Users.add(user)
    .then((saved) => {
      res.status(201).json({ saved });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    // user is from destructuring an array
    .then(([user]) => {
      // user.password is actually the hash created by bcrypt
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = username;
        res.status(200).json({ message: "welcome!" });
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/logout", (req, res) => {
  // removes the session from memory and from the store
  req.session.destroy((err) => {
    if (err) {
      res.send("unable to logout");
    } else {
      res.send("logged out");
    }
  });
});

module.exports = router;
