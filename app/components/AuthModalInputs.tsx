'use client';

import { ChangeEvent } from 'react';

export interface AuthModalInputsProps {
  isSignIn?: boolean;
  inputs: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    password: string;
  };
  handleChangeInput: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function AuthModalInputs({
  isSignIn,
  inputs,
  handleChangeInput,
}: AuthModalInputsProps) {
  return (
    <div>
      {!isSignIn && (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            name="firstName"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="First Name"
            value={inputs.firstName}
            onChange={handleChangeInput}
          />
          <input
            type="text"
            name="lastName"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="Last Name"
            value={inputs.lastName}
            onChange={handleChangeInput}
          />
        </div>
      )}
      <div className="my-3 flex justify-center text-sm">
        <input
          type="email"
          name="email"
          className="border rounded p-2 py-3 w-full"
          placeholder="Email"
          value={inputs.email}
          onChange={handleChangeInput}
        />
      </div>
      {!isSignIn && (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            name="phone"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="Phone"
            value={inputs.phone}
            onChange={handleChangeInput}
          />
          <input
            type="text"
            name="city"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="City"
            value={inputs.city}
            onChange={handleChangeInput}
          />
        </div>
      )}
      <div className="my-3 flex justify-center text-sm">
        <input
          type="password"
          name="password"
          className="border rounded p-2 py-3 w-full"
          placeholder="Password"
          value={inputs.password}
          onChange={handleChangeInput}
        />
      </div>
    </div>
  );
}
