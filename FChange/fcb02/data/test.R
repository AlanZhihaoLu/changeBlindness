setwd("~/Documents/Graduate Files/ChangeBlindness/FChange/fcb02/data")
library(tidyverse)
library(lme4)
data = read.csv('fcb02-pilot_2021_10_04.csv')
data = data[-c(64:126),]

data = data %>% filter(first_image != "example_a.jpg")

data = data %>% filter(hit == "true")

outliers = boxplot(data$rt ~ data$change_onset_alt, plot=FALSE)$out

data = data[-which(data$rt %in% outliers),]

what = data %>% 
  group_by(change_onset_alt) %>% 
  summarize(rt = mean(rt))

boxplot(data$rt ~ data$change_onset_alt)

plot(what$rt ~ what$change_onset_alt) 
