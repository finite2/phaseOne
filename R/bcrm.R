#' @import bcrm



#' @export runModelLogisticOne
runModelLogisticOne = function(data = NULL, targetTox = 0.4, inDoses = 1:7, mean = 1, variance = 0.64) {

  ## Power functional form
  ff<-"logit1"

  print(data)

  x1 = 0
  x2 = 10
  nDose = function(x){
    log(x/10)
  }
  dose <- nDose(inDoses)

  ## Lognormal prior
  prior.alpha<-list(3,mean, variance)
  ## Pre-specified probabilities of toxicity
  ## [dose levels 11-15 not specified in the paper, and are for illustration only]
  ## Data from the first 5 cohorts of 18 patients

  if(is.null(data)){
    post<-getprior(prior.alpha, 2000)
  } else {
    tox<-data$e
    notox<-data$n
    if(sum(tox,notox) > 0){
      ## Posterior distribution of the model parameter using rjags
      post<-Posterior.BRugs(tox,notox,dose,ff,prior.alpha
                          ,burnin.itr=500,production.itr=2000)
    } else {
      post<-getprior(prior.alpha, 2000)
    }
  }

  x = seq(from = x1, to = x2,length.out = 200)
  y = matrix(0,length(x),3)
  for(i in 1:length(x)){
    y[i,]=quantile(inv_logit(3 + nDose(x[i])*post),c(0.025,0.5,0.975))
  }


  while(x2-x1 > 0.05){
    xmed = (x2-x1)/2 + x1
    if(targetTox - quantile(inv_logit(3 + nDose(xmed)*post),0.5) > 0){
      x1 = xmed
    } else {
      x2 = xmed
    }
  }


  return(list(params = log(t(post)), median = median(post),
              model = data.frame(x=x,y=y[,2]),
              modelL = data.frame(x=x,y=y[,1]),
              modelU = data.frame(x=x,y=y[,3]),
              mtd = x1))
}


#' @export runModelLogisticTwo
runModelLogisticTwo = function(data = NULL, targetTox = 0.4, inDoses = 1:7) {

  ## Power functional form
  ff<-"logit2"

  print(data)

  x1 = 0.5
  x2 = 10
  nDose = function(x){
    log(x/10)
  }
  dose <- nDose(inDoses)

  ## Lognormal prior
  mu<-c(2.5,1.5)
  Sigma<-rbind(c(0.84^2,0.134),c(0.134,0.80^2))
  prior.alpha<-list(4,mu,Sigma)
  ## Pre-specified probabilities of toxicity
  ## [dose levels 11-15 not specified in the paper, and are for illustration only]
  ## Data from the first 5 cohorts of 18 patients
  if(is.null(data)){
    post <- getprior(prior.alpha, 2000)
  } else {
    tox<-data$e
    notox<-data$n
    if(sum(tox,notox) > 0){
      ## Posterior distribution of the model parameter using rjags
      post<-Posterior.BRugs(tox, notox, dose, ff, prior.alpha
                          ,burnin.itr = 2000, production.itr = 2000)
    } else {
      post<-getprior(prior.alpha, 2000)
    }

  }

  x = seq(from = x1, to = x2,length.out = 200)
  y = matrix(0,length(x),3)
  for(i in 1:length(x)){
    y[i,]=quantile(inv_logit(log(post[,1]) + nDose(x[i])*post[,2]),c(0.025,0.5,0.975))
  }


  while(x2-x1 > 0.05){
    xmed = (x2-x1)/2 + x1
    if(targetTox - quantile(inv_logit(log(post[,1]) + nDose(xmed)*post[,2]),0.5) > 0){
      x1 = xmed
    } else {
      x2 = xmed
    }
  }


  return(list(params = log(t(post)), median = c(median(post[,1]),median(post[,2])),
              model = data.frame(x=x,y=y[,2]),
              modelL = data.frame(x=x,y=y[,1]),
              modelU = data.frame(x=x,y=y[,3]),
              mtd = x1))
}
