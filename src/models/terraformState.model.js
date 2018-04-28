import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TerraformStateSchema = new Schema({
  name: String,
  locked: { type: Boolean, default: false },
  state: String,
});

mongoose.model('TerraformState', TerraformStateSchema);
