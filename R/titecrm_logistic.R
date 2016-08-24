#' @import R2jags

# useful functions
#' @export inv_logit
#' @export logit
inv_logit=function(alpha) 1/(1+exp(-alpha))
logit=function(p) log(p/(1-p))

#################################################################
## model
##' @export jags.model


#' @exportClass jagsVariables
jagsVariables=setClass("jagsVariables",slots=c(model.file="function",nSample="numeric",burnin="numeric",nThin="numeric",n.chains="numeric",parameters.to.save="character"))

#' @export runModel
runModel=function(data){



  y = data$y
  x = data$x


  jags.model=function() {
    for(i in 1:n) {
      y[i] ~ dbern(theta[i])

      logit(theta[i]) <- alpha + beta * x[i]
    }

    alpha ~ dnorm(-2, 0.5)
    beta ~ dlnorm(1, 0.5)
  }

  jagsVar=jagsVariables(model.file=jags.model,nSample=5000,burnin=500,nThin=1,n.chains=1,parameters.to.save=c("alpha", "beta"))
  n=length(y)

  j = jags(data=c("y","x","n"),
           n.chains=jagsVar@n.chains,
           model.file=jagsVar@model.file,
           parameters.to.save=jagsVar@parameters.to.save,
           n.burnin=jagsVar@burnin,
           n.iter=jagsVar@nSample+jagsVar@burnin,
           n.thin=jagsVar@nThin,
           DIC=FALSE)

  x= seq(from = 0.5, to = 7.5,length.out = 200)
  y = matrix(0,length(x),3)
  for(i in 1:length(x)){
    y[i,]=quantile(inv_logit(j$BUGSoutput$sims.list$alpha + x[i]*j$BUGSoutput$sims.list$beta),c(0.025,0.5,0.975))
  }
  target = 0.4
  x1 = 0
  x2 = 30
  while(x2-x1 > 0.05){
    xmed = (x2-x1)/2 + x1
    if(target - quantile(inv_logit(j$BUGSoutput$sims.list$alpha + xmed*j$BUGSoutput$sims.list$beta),0.5) > 0){
      x1 = xmed
    } else {
      x2 = xmed
    }
  }



  j$BUGSoutput$sims.list$alpha = j$BUGSoutput$sims.list$alpha
  j$BUGSoutput$sims.list$beta = j$BUGSoutput$sims.list$beta
  params = matrix(c(j$BUGSoutput$sims.list$alpha, j$BUGSoutput$sims.list$beta),byrow=TRUE,nrow=2)
  return(list(params=params,summary=j$BUGSoutput$summary,
              model = data.frame(x=x,y=y[,2]),
              modelL = data.frame(x=x,y=y[,1]),
              modelU = data.frame(x=x,y=y[,3]),
              mtd = x1))
}
