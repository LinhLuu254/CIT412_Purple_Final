# GCF: Send Welcome Email to Subscribers

This is a Google Cloud Function triggered by a PubSub message to the topic `email_signup`. It will send a welcome email to a new subscriber using the SendGrid API.


## Deployment Command
**Ensure you have an active Google Cloud Project**
```
gcloud functions deploy sendFavoriteBooksEmail \
--entry-point sendFavoriteBooksEmail \
--runtime nodejs18 \
--trigger-topic User_Favorite_Data \
--no-gen2

```
npm install dotenv mongodb @sendgrid/mail

```
gcloud config set project cit412-purple-final

```