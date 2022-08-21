export default function setParams(req, res, next) {
  let { from, count } = req.query;
  from = parseInt(from);
  from = from && from > 0 ? from : 0;
  count = parseInt(count);
  count = count && count > 0 ? count : 20;
  req.body = {};
  req.body.from = from;
  req.body.count = count;
  next();
}
