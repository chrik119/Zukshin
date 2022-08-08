import mongoose from 'mongoose';

const connect = () => {
  mongoose.connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log(`Error Connecting To Database: ${err}`);
      }
    }
  );
};

export default connect;
