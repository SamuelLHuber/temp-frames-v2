# Use the latest official Node.js Alpine image as a base
FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package.json ./

# Install dependencies
ENV NODE_ENV=production
RUN npm install -omit=dev

# Copy the rest of the application code to the working directory
COPY . .

# install REMIX
RUN npm install -g @remix-run/dev
# Build the Next.js application
RUN npm run build --prod

# Expose the port the app runs on
EXPOSE 5173

# Command to run the application
CMD ["npm", "start"]
