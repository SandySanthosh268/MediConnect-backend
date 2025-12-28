import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, specialization, experience, phone, location } = req.body;

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Doctor validation
    if (role === 'DOCTOR') {
      if (!phone || phone.trim() === '') {
        return res.status(400).json({ message: 'Phone number is required for doctors' });
      }
      if (!specialization) {
        return res.status(400).json({ message: 'Specialization is required for doctors' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: role || 'PATIENT',
      isApproved: role === 'DOCTOR' ? false : true,

      // Doctor-only fields
      specialization: role === 'DOCTOR' ? specialization.trim() : undefined,
      experience: role === 'DOCTOR' ? Number(experience) : undefined,
      phone: role === 'DOCTOR' ? phone.trim() : undefined,
      location: role === 'DOCTOR' ? location : undefined,
    });

    res.status(201).json({
      message:
        role === 'DOCTOR'
          ? 'Registration successful. Await admin approval.'
          : 'Registration successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Doctor approval check
    if (user.role === 'DOCTOR' && !user.isApproved) {
      return res.status(403).json({ message: 'Doctor approval pending' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
