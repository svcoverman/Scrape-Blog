const usersSchema = new mongoose.Schema({
    firstName: {
      type: String,
      trim: true,
      required: "required"
    },
    lasttName: {
      type: String, 
      trim: true,
      required: "required"
    },
    userName: {
      type: String,
      trim: true,
      required: "required"
    }
  });