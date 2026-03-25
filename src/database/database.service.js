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
  if(options.lean)doc.lean()
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

  const limit = options.limit || 10;
  const page = options.page || 1;
  const skip = options.skip || (page - 1) * limit;

  doc.skip(skip).limit(limit);

 if (options.populate) doc.populate(options.populate);
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
  const docOptions = { new: true, ...options };
  let doc = model.findOneAndUpdate(filter , update , docOptions )
  if(options.populate)doc.populate(options.populate)
  if(options.lean)doc.lean()
    
    return await doc;
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
  if(options.lean)doc.lean()
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
