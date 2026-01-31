var createError = require('http-errors');

var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var employee = require('./routes/admin/employee')
var sysUserRouter = require('./routes/admin/sysUser');
var imgRouter = require("./routes/imageUpload/image");
var imgUpload = require('./utils/imageUpload')
var announcement = require('./routes/admin/announcement')
var proprietor = require('./routes/admin/proprietor')
var vehicleInfo = require('./routes/admin/vehicleManagement/vehicleInfo')
var parkingApplication = require('./routes/admin/vehicleManagement/parkingApplication')
var parkingInfo = require('./routes/admin/vehicleManagement/parkingInfo')
var repairInfo = require('./routes/admin/repairInfo')
var complaintinfo = require('./routes/admin/complaintInfo')
var payment = require('./routes/admin/payment')
var absenceInfo = require('./routes/admin/absenceInfo')
var leaveinfo = require('./routes/admin/leavingInfo')
var userInfo = require('./routes/user/user')
var employeeAccount = require('./routes/user/employee') 
var visitorInfo = require('./routes/admin/visitorInfo')
var sendSms = require('./utils/sendSmsaliyun')
var sendSmsRonglianyun = require('./routes/sendRonglianyun')
const bodyParser = require('body-parser');
var verifyToken = require('./verify')
var app = express();
var config = require('./config')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/sysUser', sysUserRouter);
app.use("/image", imgRouter);

app.use('/announcement',announcement)
app.use('/proprietor',proprietor)
app.use('/employee',employee)
app.use('/vehicleInfo',vehicleInfo)
app.use('/parkingApplication',parkingApplication)
app.use('/parkingInfo',parkingInfo)
app.use('/repairInfo',repairInfo)
app.use('/payment',payment)
app.use('/ComplaintInfo',complaintinfo)
app.use('/absenceInfo',absenceInfo)
app.use('/leaveInfo',leaveinfo)
app.use('/visitorInfo',visitorInfo)


app.use('/employeeAccount', employeeAccount)
app.use('/userInfo', userInfo)




app.use('/imageG', imgUpload)




app.use('/sendSms',sendSms)

app.use('/sendSmsRonglianyun', sendSmsRonglianyun)


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  
  res.status(err.status || 500);
  res.render('error');
   
  if (err.name === 'UnauthorizedError') return res.send('身份认证失败！')
});

module.exports = app;
