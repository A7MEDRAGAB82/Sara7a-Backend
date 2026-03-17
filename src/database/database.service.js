export const findOne = async ({
  model,
  filter = {},
  select = "",
  options = {},
}) => {
  let doc = model.findOne(filter);
  if (select) {
    doc.select(select);
  }
  if (options.populate) {
    doc.populate(options.populate);
  }
  return await doc;
};

export const findAll = async ({
  model,
  filter = {},
  select = "",
  options = {},
}) => {
  let doc = model.find(filter)
  if (select) {
    doc.select(select);
  }
 if (options.populate) doc.populate(options.populate);
  if (options.skip) doc.skip(options.skip);
  if (options.limit) doc.limit(options.limit);
  if (options.sort) doc.sort(options.sort);
  if (options.lean) doc.lean();
  return await doc;
};

export const findOneAndUpdate = async ({
  model,
  filter = {},
  update = {},
  options = {},
}) => {
  options = { new: true, ...options };

  return await model.findOneAndUpdate(filter, update, options);
};

export const findOneAndDelete = async ({ model, filter = {} }) => {
  return await model.findOneAndDelete(filter);
};

export const findById = async ({ model, id, select = "", options = {} }) => {
  let doc = model.findById(id);
  if (select) {
    doc.select(select);
  }
  if (options.populate) {
    doc.populate(options.populate);
  }
  return await doc;
};

export const findByIdAndDelete = async ({ model, id }) => {
  return await model.findByIdAndDelete(id);
};

export const insertOne = async ({ model, data = {} }) => {
  return await model.create(data);
};

export const insertMany = async ({ model, data = [] }) => {
  return await model.insertMany(data);
};
