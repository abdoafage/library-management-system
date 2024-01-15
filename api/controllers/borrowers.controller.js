import { Borrower } from "../models/borrowers.model.js";
import { sequelize } from "../config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  /*
  #swagger.tags=['Borrower']
  #swagger.description = 'Endpoint to register a new borrower.'
   #swagger.parameters['newBorrower'] = {
      in: 'body',
      description: 'Borrower information for registration.',
      required: true,
      type: 'object',
      schema: { username:"string",email:"string",password:"string"}
   }
   #swagger.responses[201] = {
     description: 'Borrower registration successful.',
     schema: { username:"string",email:"string",password:"string",updatedAt:"date",createdAt:"date"}
   }
   #swagger.responses[400] = { description: 'Email already exists.' }
   */

  const { username, email, password } = req.body;

  // get borrower by email.
  const borrower = await Borrower.findOne({ where: { email: email } });

  // check if the borrower exist
  if (borrower)
    return res.status(400).json({ message: "the email is already exist" });

  // hash the password.
  const hashed_password = bcrypt.hashSync(password, 8);

  //   create new borrower.
  const ret_borrower = await Borrower.create({
    username,
    email,
    password: hashed_password,
  });

  res.status(201).json(ret_borrower);
};

const login = async (req, res) => {
  /*#swagger.tags=['Borrower']

  #swagger.description = 'Endpoint to login a borrower.'
  #swagger.parameters['loginCredentials'] = {
    in: 'body',
    description: 'Borrower login credentials.',
    required: true,
    type: 'object',
    schema: { email:"string",password:"string" }
  }
  #swagger.responses[200] = {
    description: 'Borrower login successful.',
    schema: { access_token:"string" }
  }
  #swagger.responses[404] = { description: 'Email not found.' }
  #swagger.responses[400] = { description: 'Incorrect password.' }
  */
  const { email, password } = req.body;

  // get borrower by sql query and will return [result:array, metadata:object]
  const [result, metadata] = await sequelize.query(
    `SELECT id, username, email, password FROM "Borrower" WHERE email = ?;`,
    { replacements: [email] }
  );

  // check if the borrower exist.
  if (!result.length)
    return res.status(404).json({ message: "email not found" });

  const borrower = result[0];
  console.log(borrower);
  // check if the password correct.
  if (!bcrypt.compareSync(password, borrower.password))
    return res.status(400).json({ message: "password not correct" });

  const data_payload = {
    id: borrower.id,
    username: borrower.username,
    email: borrower.email,
    createdAt: borrower.createdAt,
  };

  // get JWT authentication token.
  const access_token = jwt.sign(data_payload, process.env.ACCESS_TOKEN, {
    algorithm: "HS256",
    expiresIn: "12h",
  });

  res.cookie("access_token", access_token, { httpOnly: true });
  return res.status(200).json({ access_token });
};

const updateBorrowerDetails = async (req, res) => {
  /*#swagger.tags=['Borrower']

#swagger.description = 'Endpoint to update borrower details.'
#swagger.parameters['borrowerId'] = {
  in: 'path',
  description: 'ID of the borrower to be updated.',
  required: true,
  type: 'integer'
}
#swagger.parameters['updatedDetails'] = {
  in: 'body',
  description: 'Updated borrower details.',
  required: true,
  type: 'object',
  schema: { username:"string" }
}
#swagger.responses[200] = {
  description: 'Borrower details updated successfully.',
  schema: { id:"int", username:"string", email:"string", password:"string", createdAt:"date", updatedAt:"date" }
}
#swagger.responses[400] = { description: 'Bad request.' }
*/
  const { id } = req.params;
  const { username } = req.body;

  try {
    const borrower = await Borrower.update({ username }, { where: { id } });
    console.log(borrower);
    res.status(200).json(borrower);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getSpecificBorrower = async (req, res) => {
  /* #swagger.tags=['Borrower']

#swagger.description = 'Endpoint to get specific borrower details.'
#swagger.parameters['borrowerId'] = {
  in: 'path',
  description: 'ID of the borrower to retrieve details.',
  required: true,
  type: 'integer'
}
#swagger.responses[200] = {
  description: 'Borrower details retrieved successfully.',
  schema: { id:"int", username:"string", email:"string", password:"string", createdAt:"date", updatedAt:"date"  }
}
#swagger.responses[404] = { description: 'Borrower not found.' }*/

  const { id } = req.params;
  const SQL_query = `SELECT id, username, email, password, createdAt, updatedAt 
FROM "Borrower"
WHERE id = ?`;
  const [borrower, metadata] = await sequelize.query(SQL_query, {
    replacements: [id],
  });

  if (!borrower) {
    return res.status(404).json({ message: "borrower not found" });
  }

  return res.status(200).json(borrower);
};

const getAllBorrowers = async (req, res) => {
  /*#swagger.tags=['Borrower']

#swagger.description = 'Endpoint to get all borrowers.'
#swagger.responses[200] = {
  description: 'List of all borrowers.',
  schema: { id:"int", username:"string", email:"string", password:"string", createdAt:"date", updatedAt:"date" }
}*/
  const SQL_query = `SELECT id, username, email, password, createdAt, updatedAt 
FROM "Borrower"`;
  const [borrowers, metadata] = await sequelize.query(SQL_query);
  res.status(200).json(borrowers);
};

const deleteBorrowers = async (req, res) => {
  /* #swagger.tags=['Borrower']

  #swagger.description = 'Endpoint to delete a borrower.'
  #swagger.parameters['borrowerId'] = {
    in: 'path',
    description: 'ID of the borrower to be deleted.',
    required: true,
    type: 'integer'
  }
  #swagger.responses[200] = {
    description: 'Borrower deleted successfully.',
    schema: { id:"int", username:"string", email:"string", password:"string", createdAt:"date", updatedAt:"date" }
  }
  #swagger.responses[404] = { description: 'Borrower not found.' }*/

  const { id } = req.params;
  const SQL_query = `DELETE FROM "Borrower"
WHERE id = ?
RETURNING id, username, email, password, createdAt, updatedAt`;
  const [data, metadata] = await sequelize.query(SQL_query, {
    replacements: [id],
  });
  if (data.length) {
    return res.status(200).json(data);
  } else {
    return res
      .status(404)
      .json({ message: "borrower does not exist to delete" });
  }
};

export {
  register,
  login,
  updateBorrowerDetails,
  getSpecificBorrower,
  getAllBorrowers,
  deleteBorrowers,
};
