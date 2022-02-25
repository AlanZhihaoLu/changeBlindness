remove_duplicates = function(data) {
  trial_count = data %>% group_by(sbj_id) %>% summarize(count = n())
  dup_sbjs = data.frame(trial_count[which(trial_count$count > 63),'sbj_id'])
  if (nrow(dup_sbjs)>0) {
    print("Duplicate trials for subjects:")
    print(dup_sbjs$sbj_id)
    for (sbj in dup_sbjs$sbj_id) {
      print(paste("Removing duplicate trials for", sbj))
      sbj_sub = data %>% filter(sbj_id == sbj)
      data = data %>% filter(sbj_id != sbj)
      sbj_sub = sbj_sub[1:63,]
      rbind(data, sbj_sub)
    }
  } else {
    print("No duplicate trials found.")
  }
  return(data)
}

assess_hitrate = function(data) {
  hitrate_df = data %>% group_by(sbj_id) %>% summarize(hit_rate = mean(hit=='true')) %>% data.frame()
  lowhitrate = hitrate_df[hitrate_df$hit_rate < 0.9,]
  print("Low hit rate subjects:")
  if (nrow(lowhitrate)==0) {
    print("None")
  } else {
    for (i in 1:nrow(lowhitrate)) {
      print(paste0(lowhitrate$sbj_id[i],': ', lowhitrate$hit_rate[i]))
      remove_ind = readline(prompt=paste0("Remove ", lowhitrate$sbj_id[i], "? ([Y]/N)"))
      if (remove_ind != 'N') {
        print(paste("Removing", lowhitrate$sbj_id[i]))
        data = data %>% filter(sbj_id != lowhitrate$sbj_id[i])
      }
    }
  }
  return(data)
}

preprocess_data = function(data) {
  null_rt_sbjs = unique(data[which(data$rt == "null"),"sbj_id"])
  if (length(null_rt_sbjs > 0)) {
    print("Null subjects:")
    print(null_rt_sbjs)
    data = data %>% filter(sbj_id != null_rt_sbjs)
  }
  data$rt = as.numeric(data$rt)
  data$n_alts = ceiling(data$rt/240)
  print("Looking for duplicates...")
  data = remove_duplicates(data)
  print("Assessing hit rates...")
  data = assess_hitrate(data)
  data = data %>% filter(first_image != "example_a.jpg")
  return(data)
}

# get_n = function(data, target_n) {
#   count_df = data %>% group_by(cond) %>% summarize(count = length(unique(sbj_id))) %>% data.frame()
#   missing_df = count_df[which(count_df$count - target_n != 0),]
#   if (nrow(missing_df)==0) {
#     print(paste0("All conditions have ",target_n, " subjects"))
#   }
#   for (i in 1:nrow(missing_df)) {
#     n_sbjs = missing_df$count[i] + 4
#     if (n_sbjs[i] > target_n) {
#       print(paste0(missing_df$cond[i], ' has ', missing_df$count, ', and is missing ', target_n - missing_df$cond[i]))
#     } else {
#       print(paste0(missing_df$cond[i], ' has ', missing_df$count, ', and has an extra ', missing_df$cond[i] - target_n))
#     }
#   }
# }