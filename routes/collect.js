const express = require('express');

/**
 *
 * @param {{receiver: import('../services/receiver.service')}} receiver
 */
module.exports = ({ receiver }) => {
  const router = express.Router();
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  const accumulate = (req, res, next) => {
    receiver.receive(req.body);

    res.status(202).end();
  };

  router.post('/', accumulate);

  return router;
};
