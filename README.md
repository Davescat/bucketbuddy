# Bucket Buddy

## The problem

Amazon's S3 is great and a very versatile storage service, however it is harder for non-developers to use to manage their objects (such as image files like JPG, PNG, etc.). It can be difficult to navigate an S3 bucket when there are no thumbnails for the images present and no predefined values for tags to be used for objects.

## This solution

Bucket Buddy is a simple React application used to be a tool for users to better manage their S3 bucket objects.

This application can be used to:

- navigate an existing bucket
- upload and delete files
- see the thumbnails of image files
- edit and add tags to an object
- create a schema which will be used to add predefined tags to all objects

## Requirements before installing

### NPM

This project uses React which is a Javascript library. You will need to have some things installed before being able to download and run the project locally.

Ensure to install npm which is a tool used to install all the Javascript modules you will need to run the project. If you are not sure if you have it installed, open your terminal (you can use PowerShell on Windows) and copy paste the following command `npm -v`. If there is an error running the command it means you need to download npm. The simplest way of installing it is downloading it with NodeJS [here](https://nodejs.org/en/)

### Bucket Buddy IAM Role

AWS uses IAM Roles for all their services to handle security and user permissions. Ask you AWS Administrator to give the account crednetials you will use with Bucket Buddy the following permissions

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:GetObjectTagging",
                "s3:PutObjectTagging",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::*/*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::*"
        },
        {
            "Sid": "VisualEditor2",
            "Effect": "Allow",
            "Action": "s3:HeadBucket",
            "Resource": "*"
        }
    ]
}
```

## Installation and running locally

1. Download a ZIP of the project by clicking [here](https://github.com/js-montreal/bucketbuddy/archive/master.zip)
2. Unzip the file wherever you wish (ex: on your Desktop)
3. Open a terminal in the folder you unzipped the files in and type the following command to install everything you need in the project:

```
npm install
```

4. After everything has sucessfully installed, you are ready to start the application by cpy pasting and running the following command in your terminal:

```
npm start
```

5. If run successfully you should see the application start in your default browser and be greeted with the following screen asking you to connect t your bucket :)

![Image of Bucket Buddy connect screen](./public/connect-to-bucket-screen.jpg)

## How to use the app

### Connect to your bucket

Bucket Buddy follows the ideology that a user can connect to their bucket by entering the bucket's name, the user's access key and secret access key, and the bucket's region. By going to the main page you will be created with the connection screen above where you can enter all the details to connect to your bucket. If you are unsure ask you AWS adminstrator for the needed details.

![Image of Bucket Buddy connect screen](./public/connect-to-bucket.gif)

### Navigating through the bucket

Navigating through the bucket is similar to a file explorer (folders and files are group together). You can always go back by simply selecting the folder you wish to view in the breadcrumb path above the men buttons

![Image of Bucket Buddy connect screen](./public/navigating-in-bucket.gif)

### Creating/Editing a schema for your objects' tags

Coming soon ...

### Viewing an object and editing an object's tags

Coming soon ...

### Uploading objects to your bucket

Coming soon ...
