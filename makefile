.PHONY: readmission create analyze analysis conditon_data cohort EDA conditon_flags polypharmacy_flags visualize_flags model all clean clean_images clean_csv clean_html

# 1- run to fetch given mental health concepts and ids from the OMOP database
condition_data:
	python src/get_condition_ids.py

# 2- run to create the cohort including the aphasia flag
cohort:
	python src/create_cohort.py

# 3- run to get a look into the cohort data
EDA:
	python src/EDA.py

# 4 - run to get all condition flags
condition_flags:
	python src/create_condition_flags.py

# 5 - run to medicine counts and polypharmacy counts
polypharmacy_flags:
	python src/create_polypharmacy_flags.py

# 6 - run to create a pairwise comparison and a chord graph
visualize_flags:
	python src/flag_visualizations.py

# 7 - run to create readmission result
readmission: create analyze

create:
	python src/create_readmission_flags.py

analyze: create
	python src/analyze_readmissions.py

# 8 - run to create Asphasia-PIM analysis result
analysis:
	python src/upload_medication_and_condition_lists.py
	python src/analyze_flags.py

# 9 - run to create model
model:
	python src/run_xgb.py

# Run everything
all:
	make condition_data
	make cohort
	make condition_flags
	make polypharmacy_flags
	make visualize_flags
	make analysis
	make readmission
	make model
	make clean

#### Cleaning
clean_images:
	rm -f data/*.{jpg,jpeg,png}

clean_csv:
	rm -f data/*.csv

clean_html:
	rm -f data/*.html

clean:
	make clean_images
	make clean_csv
	make clean_html
