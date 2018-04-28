import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TerraformStateSchema = new Schema({
  name: String,
  locked: { type: Boolean, default: false },
  state: Object,
});

mongoose.model('TerraformState', TerraformStateSchema);
