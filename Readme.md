
# Photo Roster
-------------

1. [Introduction](#introduction)
2. [Requirements](#requirements)
3. [Integration](#integration)
4. [Usage](#usage)
   - [Initialization](#initialization)
   - [Maintenance](#maintenance)
5. [Contact Us](#contact-us)

## Introduction

The Photo Roster is a LTI tool in Canvas that allows instructors to view photos of students of their sections and to export the roster. This tool appears in the course navigation menu of all registrar-based classes, and is not visible to students. Because university photos are protected under the federal Family Educational Rights and Privacy Act (FERPA), only instructors of record are authorized to view the roster. 

## Requirements
- Canvas
- EduAppCenter
- CSV file mapping Section(SIS ID) and Instructor(SIS ID)
## Integration
- Generate a csv in the specified format containing SIS ID’s of the course’s students and the instructor of record.
- Deploy the application on your school's server. You can follow this [guide][2]
- Install the application on your own instance of EduAppCenter or use our default configured settings [here][3]. 
- Generate Developer Keys and Admin access token for the LTI by following steps [here][4] and [here][5].
- You need to update the variables with your values in config.js file under /config folder.
- Install the LTI on your instance of Canvas by following steps [here][6].

> **Note:**
> - Server must be secure in order for the LTI to work.
> - You can customize error page according to your needs.
> - We are using external csv to map Sections with their Instructors as that information might not be latest on the Canvas.
> - You might need to make some changes in the authentication.js file inorder to match SIS ID mapping as per your institution.

## Usage
#### Initialization
Demo video (coming soon)
#### Maintenance
- You need to update the CSV file mapping Section(SIS ID) and Instructor(SIS ID) every term.


## Contact Us
Learning and Teaching Center  
Northwest Missouri State University  
800 University Drive  
Maryville, MO - 64468  

Email: [ltcite@nwmissouri.edu](ltcite@nwmissouri.edu)  
Phone: (660) 562-1532

[1]: https://canvas.instructure.com/
[2]: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04
[3]: http://eduappcenter.com/
[4]: https://community.canvaslms.com/docs/DOC-10864-4214441833
[5]: https://community.canvaslms.com/docs/DOC-10806-4214724194
[6]: https://community.canvaslms.com/docs/DOC-10756-421474559
