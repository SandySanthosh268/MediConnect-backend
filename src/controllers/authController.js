import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'PATIENT', specialization, experience } = req.body;

    /* 🔹 Check existing user */
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    /* 🔹 Hash password */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /* 🔹 Create User (AUTH ONLY) */
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    /* 🔹 Create Role-Specific Profile */
    if (role === 'DOCTOR') {
      if (!specialization) {
        return res.status(400).json({ message: 'Specialization is required' });
      }

      await Doctor.create({
        user: user._id,
        specialization,
        experience: experience || 1,
        isApproved: false, // admin approval required
      });
    }

    if (role === 'PATIENT') {
      await Patient.create({
        user: user._id,
      });
    }

    res.status(201).json({
      message:
        role === 'DOCTOR'
          ? 'Registration successful. Await admin approval.'
          : 'Registration successful. Please login.',
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

    /* 🔹 Find user */
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    /* 🔹 Check password */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    /* 🔹 Doctor approval check */
    if (user.role === 'DOCTOR') {
      const doctor = await Doctor.findOne({ user: user._id });

      if (!doctor) {
        return res.status(403).json({ message: 'Doctor profile not found' });
      }

      if (!doctor.isApproved) {
        return res.status(403).json({ message: 'Doctor approval pending' });
      }
    }

    /* 🔹 Generate token */
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
