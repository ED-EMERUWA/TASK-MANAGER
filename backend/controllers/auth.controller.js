import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import Org from '../models/Org.js';
import RolePermission from '../models/RolePermission.js';
import Permission from '../models/Permission.js';

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const rolePermissions = await RolePermission.findAll({
      where: { role_id: user.role },
      include: [{ model: Permission, as: 'Permission', attributes: ['name'] }]
    });

    const permissions = rolePermissions.map(rp => rp.Permission.name);
    const role = await Role.findByPk(user.role, { attributes: ['name'] });

    const token = jwt.sign(
      {
        username: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: role.name,
        permissions
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const signup = async (req, res) => {
  const { firstName, lastName, email, role, password, userOrg } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const roleRecord = await Role.findOne({ where: { name: role } });
    if (!roleRecord) return res.status(400).json({ message: 'Role not found' });

    const org = await Org.findOne({ where: { id: userOrg } });
    const org_id = org ? org.id : null;

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      role: roleRecord.id,
      password: hashedPassword,
      org_id
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: roleRecord.name
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
