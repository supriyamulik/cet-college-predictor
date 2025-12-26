import pandas as pd
import numpy as np
from typing import List, Dict, Optional, Tuple
import os
from collections import defaultdict

class CollegeComparator:
    """
    Enhanced College Comparison Module with:
    - Category/Branch normalization and mapping
    - Multi-year trend analysis (2021-2025)
    - College URL integration
    - Type-based filtering
    - Comprehensive comparison metrics
    """
    
    # ============================================================================
    # CATEGORY MAPPING (Normalized groups)
    # ============================================================================
    CATEGORY_GROUPS = {
        'OPEN': {
            'codes': ['GOPENS', 'GOPENH', 'LOPENS', 'LOPENH'],
            'display_name': 'Open Category',
            'description': 'General Open seats (Male/Female)'
        },
        'OBC': {
            'codes': ['GOBCS', 'GOBCO', 'GOBCH', 'LOBCS', 'LOBCO', 'LOBCH'],
            'display_name': 'OBC Category',
            'description': 'Other Backward Classes'
        },
        'SC': {
            'codes': ['GSCS', 'GSCO', 'GSCH', 'LSCS', 'LSCO', 'LSCH'],
            'display_name': 'SC Category',
            'description': 'Scheduled Caste'
        },
        'ST': {
            'codes': ['GSTS', 'GSTO', 'GSTH', 'LSTS', 'LSTO', 'LSTH'],
            'display_name': 'ST Category',
            'description': 'Scheduled Tribe'
        },
        'NT1': {
            'codes': ['GRNT1S', 'GRNT1H', 'LRNT1S', 'LRNT1H'],
            'display_name': 'NT-1 Category',
            'description': 'Nomadic Tribe 1'
        },
        'NT2': {
            'codes': ['GRNT2S', 'GRNT2H', 'LRNT2S', 'LRNT2H'],
            'display_name': 'NT-2 Category',
            'description': 'Nomadic Tribe 2'
        },
        'NT3': {
            'codes': ['GRNT3S', 'GRNT3H', 'LRNT3S', 'LRNT3H'],
            'display_name': 'NT-3 Category',
            'description': 'Nomadic Tribe 3'
        },
        'VJ': {
            'codes': ['GVJS', 'GVJH', 'LVJS', 'LVJH'],
            'display_name': 'VJ/DT Category',
            'description': 'Vimukta Jati'
        },
        'EWS': {
            'codes': ['GEWSS', 'GEWSH', 'LEWSS', 'LEWSH'],
            'display_name': 'EWS Category',
            'description': 'Economically Weaker Section'
        },
        'DEF': {
            'codes': ['DEFOPENS', 'DEFOBCS', 'DEFRNT1S', 'DEFRNT2S', 'DEFRNT3S'],
            'display_name': 'Defence Category',
            'description': 'Defence Quota'
        },
        'PWD': {
            'codes': ['PWDOPENH', 'PWDOPENS', 'PWDOBCS', 'PWDOBCH', 'PWDRNT1S', 
                     'PWDRNT2S', 'PWDRNT3S', 'PWDSEBCS', 'PWDSTS', 'PWDSCS', 'PWDSCH'],
            'display_name': 'PWD Category',
            'description': 'Persons with Disabilities'
        },
        'TFWS': {
            'codes': ['TFWS'],
            'display_name': 'TFWS',
            'description': 'Tuition Fee Waiver Scheme'
        },
        'MI': {
            'codes': ['MI'],
            'display_name': 'Minority',
            'description': 'Minority Quota'
        },
        'ORPHAN': {
            'codes': ['ORPHAN'],
            'display_name': 'Orphan',
            'description': 'Orphan Category'
        }
    }
    
    # ============================================================================
    # BRANCH MAPPING (Normalized groups for similar branches)
    # ============================================================================
    BRANCH_GROUPS = {
        'Computer Science & Engineering': [
            'Computer Science and Engineering',
            'Computer Engineering',
            'Computer Science',
            'CSE',
            'Computer Sci',
            'Comp Sci',
            'Computer'
        ],
        'Artificial Intelligence & Machine Learning': [
            'Artificial Intelligence and Machine Learning',
            'AI & ML',
            'AIML',
            'AI/ML',
            'Artificial Intelligence',
            'Machine Learning'
        ],
        'Artificial Intelligence & Data Science': [
            'Artificial Intelligence and Data Science',
            'AI & DS',
            'AIDS',
            'AI/DS',
            'Data Science',
            'Data Analytics'
        ],
        'Electronics & Telecommunication': [
            'Electronics and Telecommunication Engineering',
            'Electronics & Telecom',
            'E&TC',
            'ENTC',
            'Electronics',
            'Telecommunication'
        ],
        'Information Technology': [
            'Information Technology',
            'IT',
            'Info Tech'
        ],
        'Mechanical Engineering': [
            'Mechanical Engineering',
            'Mechanical',
            'Mech',
            'ME'
        ],
        'Civil Engineering': [
            'Civil Engineering',
            'Civil',
            'CE'
        ],
        'Electrical Engineering': [
            'Electrical Engineering',
            'Electrical',
            'EE',
            'Electrical & Electronics'
        ],
        'Chemical Engineering': [
            'Chemical Engineering',
            'Chemical',
            'ChE'
        ],
        'Instrumentation Engineering': [
            'Instrumentation Engineering',
            'Instrumentation',
            'IE',
            'Instrumentation & Control'
        ],
        'Biotechnology': [
            'Biotechnology',
            'Biotech',
            'BT'
        ],
        'Production Engineering': [
            'Production Engineering',
            'Production',
            'PE'
        ],
        'Automobile Engineering': [
            'Automobile Engineering',
            'Automobile',
            'Auto'
        ]
    }
    
    # ============================================================================
    # COLLEGE TYPE MAPPING
    # ============================================================================
    COLLEGE_TYPE_GROUPS = {
        'Government': [
            'Government',
            'Govt'
        ],
        'Autonomous': [
            'Autonomous / Government',
            'Autonomous / Aided',
            'Autonomous / Private',
            'Autonomous'
        ],
        'University': [
            'State Technological University',
            'University Department',
            'Deemed University',
            'State Private University',
            'Deemed University (Off-Campus)'
        ],
        'Private': [
            'Private (Unaided)',
            'Unaided',
            'Private'
        ]
    }
    
    def __init__(self,
                 merged_data_path: str = 'data/merged_cutoff_2021_2025.csv',
                 individual_data_dir: str = 'data/cutoff_trends',
                 colleges_url_path: str = 'data/Colleges_URL.xlsx',
                 main_data_path: str = 'data/flattened_CAP_data done.xlsx'):
        """
        Initialize the College Comparator with multi-source data loading
        """
        try:
            # Load merged cutoff data (2021-2025)
            self.merged_data = self._load_merged_data(merged_data_path)
            
            # Load individual year files as fallback
            self.individual_data = self._load_individual_data(individual_data_dir)
            
            # Load college URLs
            self.college_urls = self._load_college_urls(colleges_url_path)
            
            # Load main college metadata
            self.college_metadata = self._load_college_metadata(main_data_path)
            
            # Build reverse category mapping for normalization
            self.category_code_to_group = {}
            for group, data in self.CATEGORY_GROUPS.items():
                for code in data['codes']:
                    self.category_code_to_group[code] = group
            
            # Build reverse branch mapping for normalization
            self.branch_name_to_group = {}
            for group, variations in self.BRANCH_GROUPS.items():
                for variation in variations:
                    self.branch_name_to_group[variation.lower()] = group
            
            # Build reverse type mapping
            self.type_name_to_group = {}
            for group, variations in self.COLLEGE_TYPE_GROUPS.items():
                for variation in variations:
                    self.type_name_to_group[variation.lower()] = group
            
            print("✅ College Comparator initialized successfully!")
            print(f"   - Merged data: {len(self.merged_data)} records")
            print(f"   - Individual data: {len(self.individual_data)} records")
            print(f"   - College URLs: {len(self.college_urls)} colleges")
            print(f"   - Category groups: {len(self.CATEGORY_GROUPS)}")
            print(f"   - Branch groups: {len(self.BRANCH_GROUPS)}")
            
            # Debug: Print sample data columns
            if not self.merged_data.empty:
                print(f"   - Merged data columns: {list(self.merged_data.columns)}")
            if not self.individual_data.empty:
                print(f"   - Individual data columns: {list(self.individual_data.columns)}")
            
        except Exception as e:
            print(f"❌ Error initializing College Comparator: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    # ============================================================================
    # DATA LOADING METHODS
    # ============================================================================
    
    def _load_merged_data(self, path: str) -> pd.DataFrame:
        """Load merged cutoff data (2021-2025)"""
        try:
            if os.path.exists(path):
                df = pd.read_csv(path)
                # Ensure college_code is string for consistent comparison
                df['college_code'] = df['college_code'].astype(str).str.strip()
                df['year'] = df['year'].astype(str)
                df['category'] = df['category'].astype(str).str.strip().str.upper()
                df['branch_name'] = df['branch_name'].astype(str).str.strip()
                print(f"✅ Loaded merged data: {len(df)} records")
                return df
            else:
                print(f"⚠️ Merged data file not found: {path}")
                return pd.DataFrame()
        except Exception as e:
            print(f"❌ Error loading merged data: {e}")
            import traceback
            traceback.print_exc()
            return pd.DataFrame()
    
    def _load_individual_data(self, dir_path: str) -> pd.DataFrame:
        """Load individual year files (2021-2025) as fallback"""
        try:
            if not os.path.exists(dir_path):
                print(f"⚠️ Individual data directory not found: {dir_path}")
                return pd.DataFrame()
            
            all_data = []
            for year in ['2021', '2022', '2023', '2024', '2025']:
                file_path = os.path.join(dir_path, f"{year}.csv")
                if os.path.exists(file_path):
                    df_year = pd.read_csv(file_path)
                    df_year['year'] = year
                    # Ensure consistent data types
                    df_year['college_code'] = df_year['college_code'].astype(str).str.strip()
                    df_year['category'] = df_year['category'].astype(str).str.strip().str.upper()
                    df_year['branch_name'] = df_year['branch_name'].astype(str).str.strip()
                    all_data.append(df_year)
                    print(f"   ✓ Loaded {year}: {len(df_year)} records")
            
            if all_data:
                df_combined = pd.concat(all_data, ignore_index=True)
                print(f"✅ Combined individual data: {len(df_combined)} records")
                return df_combined
            else:
                print("⚠️ No individual year files found")
                return pd.DataFrame()
                
        except Exception as e:
            print(f"❌ Error loading individual data: {e}")
            import traceback
            traceback.print_exc()
            return pd.DataFrame()
    
    def _load_college_urls(self, path: str) -> Dict[str, str]:
        """Load college URLs from Excel file"""
        try:
            if os.path.exists(path):
                df = pd.read_excel(path)
                
                # Debug: Print column names to see what we have
                print(f"   URL file columns: {list(df.columns)}")
                
                url_map = {}
                for _, row in df.iterrows():
                    # Try different possible column names
                    college_code = None
                    url = None
                    
                    # Check for College Code column
                    if 'College Code' in df.columns:
                        college_code = str(row['College Code']).strip()
                    elif 'college_code' in df.columns:
                        college_code = str(row['college_code']).strip()
                    
                    # Check for URL column
                    if 'URL' in df.columns:
                        url = str(row['URL']).strip()
                    elif 'url' in df.columns:
                        url = str(row['url']).strip()
                    
                    # Clean up URL
                    if url and url != 'nan' and url.lower() != 'nan':
                        # Add https:// if missing
                        if url.startswith('www.'):
                            url = 'https://' + url
                        elif not url.startswith('http://') and not url.startswith('https://'):
                            url = 'https://' + url
                        
                        if college_code:
                            url_map[college_code] = url
                
                print(f"✅ Loaded {len(url_map)} college URLs")
                
                # Debug: Show first 3 mappings
                if url_map:
                    print(f"   Sample URLs:")
                    for i, (code, url) in enumerate(list(url_map.items())[:3]):
                        print(f"      {code}: {url}")
                
                return url_map
            else:
                print(f"⚠️ College URL file not found: {path}")
                return {}
        except Exception as e:
            print(f"❌ Error loading college URLs: {e}")
            import traceback
            traceback.print_exc()
            return {}
    
    def _load_college_metadata(self, path: str) -> pd.DataFrame:
        """Load main college metadata"""
        try:
            if os.path.exists(path):
                df = pd.read_excel(path)
                print(f"✅ Loaded college metadata: {len(df)} records")
                return df
            else:
                print(f"⚠️ College metadata file not found: {path}")
                return pd.DataFrame()
        except Exception as e:
            print(f"❌ Error loading college metadata: {e}")
            return pd.DataFrame()
    
    # ============================================================================
    # NORMALIZATION METHODS
    # ============================================================================
    
    def normalize_category(self, category_code: str) -> str:
        """Normalize category code to group name"""
        if pd.isna(category_code):
            return 'Unknown'
        code_upper = str(category_code).strip().upper()
        return self.category_code_to_group.get(code_upper, code_upper)
    
    def normalize_branch(self, branch_name: str) -> str:
        """Normalize branch name to group name"""
        if pd.isna(branch_name):
            return 'Unknown'
        branch_lower = str(branch_name).strip().lower()
        
        # Check for exact match first
        for group, variations in self.BRANCH_GROUPS.items():
            if any(var.lower() == branch_lower for var in variations):
                return group
        
        # Check for partial match
        for group, variations in self.BRANCH_GROUPS.items():
            if any(var.lower() in branch_lower for var in variations):
                return group
        
        return branch_name  # Return original if no match
    
    def normalize_college_type(self, type_name: str) -> str:
        """Normalize college type to group name"""
        if pd.isna(type_name):
            return 'Unknown'
        type_lower = str(type_name).strip().lower()
        
        for group, variations in self.COLLEGE_TYPE_GROUPS.items():
            if any(var.lower() in type_lower for var in variations):
                return group
        
        return type_name  # Return original if no match
    
    # ============================================================================
    # DATA RETRIEVAL METHODS
    # ============================================================================
    
    def get_college_data(self, college_code: str, branch: str, category: str) -> List[Dict]:
        """
        Get college data for comparison with fallback to individual files
        
        Args:
            college_code: College code (as string)
            branch: Branch name (will be normalized)
            category: Category code (will be normalized to uppercase)
        
        Returns:
            List of data records for all available years
        """
        print(f"\n🔍 Getting data for college {college_code}, branch: {branch}, category: {category}")
        
        # Normalize inputs
        college_code = str(college_code).strip()
        category = str(category).strip().upper()
        branch_normalized = self.normalize_branch(branch)
        
        print(f"   Normalized branch: {branch_normalized}")
        print(f"   Category (uppercase): {category}")
        
        # Try merged data first
        data = self._get_from_merged(college_code, branch, branch_normalized, category)
        print(f"   Found {len(data)} records from merged data")
        
        # Fallback to individual files if merged data is incomplete
        if len(data) < 3:  # If less than 3 years of data
            individual_data = self._get_from_individual(college_code, branch, branch_normalized, category)
            print(f"   Found {len(individual_data)} records from individual data")
            
            # Merge results, preferring merged data for overlapping years
            existing_years = {str(d['year']) for d in data}
            for record in individual_data:
                if str(record['year']) not in existing_years:
                    data.append(record)
        
        # Sort by year
        data.sort(key=lambda x: x['year'])
        
        print(f"   Total data points: {len(data)}")
        return data
    
    def _get_from_merged(self, college_code: str, branch: str, 
                         branch_normalized: str, category: str) -> List[Dict]:
        """Get data from merged file"""
        if self.merged_data.empty:
            return []
        
        try:
            # Filter by college code (string comparison)
            df = self.merged_data[
                self.merged_data['college_code'] == college_code
            ].copy()
            
            print(f"      Merged - After college filter: {len(df)} records")
            
            if len(df) == 0:
                return []
            
            # Filter by branch (check both original and normalized)
            branch_mask = (
                (df['branch_name'].str.lower() == branch.lower()) |
                (df['branch_name'].apply(self.normalize_branch) == branch_normalized)
            )
            df = df[branch_mask]
            
            print(f"      Merged - After branch filter: {len(df)} records")
            
            if len(df) == 0:
                # Debug: Show available branches
                available = self.merged_data[
                    self.merged_data['college_code'] == college_code
                ]['branch_name'].unique()
                print(f"      Available branches: {list(available)[:5]}")
                return []
            
            # Filter by category
            df = df[df['category'] == category]
            
            print(f"      Merged - After category filter: {len(df)} records")
            
            if len(df) == 0:
                # Debug: Show available categories
                available = self.merged_data[
                    self.merged_data['college_code'] == college_code
                ]['category'].unique()
                print(f"      Available categories: {list(available)[:10]}")
                return []
            
            # Add normalized fields
            df['branch_normalized'] = df['branch_name'].apply(self.normalize_branch)
            df['category_normalized'] = df['category'].apply(self.normalize_category)
            df['type_normalized'] = df['type'].apply(self.normalize_college_type) if 'type' in df.columns else 'Unknown'
            
            # Add college URL
            df['college_url'] = self.college_urls.get(college_code, '')
            
            return df.to_dict('records')
            
        except Exception as e:
            print(f"⚠️ Error getting merged data for {college_code}: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def _get_from_individual(self, college_code: str, branch: str,
                            branch_normalized: str, category: str) -> List[Dict]:
        """Get data from individual year files"""
        if self.individual_data.empty:
            return []
        
        try:
            # Filter by college code (string comparison)
            df = self.individual_data[
                self.individual_data['college_code'] == college_code
            ].copy()
            
            if len(df) == 0:
                return []
            
            # Filter by branch
            branch_mask = (
                (df['branch_name'].str.lower() == branch.lower()) |
                (df['branch_name'].apply(self.normalize_branch) == branch_normalized)
            )
            df = df[branch_mask]
            
            if len(df) == 0:
                return []
            
            # Filter by category
            df = df[df['category'] == category]
            
            if len(df) == 0:
                return []
            
            # Add normalized fields
            df['branch_normalized'] = df['branch_name'].apply(self.normalize_branch)
            df['category_normalized'] = df['category'].apply(self.normalize_category)
            df['type_normalized'] = df['type'].apply(self.normalize_college_type) if 'type' in df.columns else 'Unknown'
            
            # Add college URL
            df['college_url'] = self.college_urls.get(college_code, '')
            
            return df.to_dict('records')
            
        except Exception as e:
            print(f"⚠️ Error getting individual data for {college_code}: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def get_all_colleges(self, filters: Dict = None) -> List[Dict]:
        """
        Get all unique colleges (without branch/category filtering)
        
        Args:
            filters: Optional filters for city, type (NO year filter)
        
        Returns:
            List of unique college records
        """
        # Use merged data, fallback to individual
        df = self.merged_data if not self.merged_data.empty else self.individual_data
        
        if df.empty:
            return []
        
        df_filtered = df.copy()
        
        # Apply filters
        if filters:
            if filters.get('city'):
                df_filtered = df_filtered[
                    df_filtered['city'].str.contains(filters['city'], case=False, na=False)
                ]
            
            if filters.get('type'):
                df_filtered = df_filtered[
                    df_filtered['type'].apply(self.normalize_college_type) == filters['type']
                ]
        
        # Get latest year data
        latest_year = df_filtered['year'].max() if len(df_filtered) > 0 else '2025'
        df_latest = df_filtered[df_filtered['year'] == latest_year]
        
        # Get unique colleges (group by college_code)
        df_unique = df_latest.drop_duplicates(subset=['college_code'], keep='first').copy()
        
        # Add normalized fields
        df_unique['type_normalized'] = df_unique['type'].apply(self.normalize_college_type) if 'type' in df_unique.columns else 'Unknown'
        
        # Add URLs
        df_unique['college_url'] = df_unique['college_code'].map(self.college_urls)
        
        return df_unique.to_dict('records')
    
    def search_colleges(self, query: str, filters: Dict = None) -> List[Dict]:
        """Search colleges by name"""
        df = self.merged_data if not self.merged_data.empty else self.individual_data
        
        if df.empty:
            return []
        
        # Apply search query
        df_filtered = df[
            df['college_name'].str.contains(query, case=False, na=False)
        ].copy()
        
        # Apply filters
        if filters:
            if filters.get('city'):
                df_filtered = df_filtered[
                    df_filtered['city'].str.contains(filters['city'], case=False, na=False)
                ]
            
            if filters.get('type'):
                df_filtered = df_filtered[
                    df_filtered['type'].apply(self.normalize_college_type) == filters['type']
                ]
        
        # Get unique colleges
        latest_year = df_filtered['year'].max() if len(df_filtered) > 0 else '2025'
        df_latest = df_filtered[df_filtered['year'] == latest_year]
        df_unique = df_latest.drop_duplicates(subset=['college_code'], keep='first').copy()
        
        # Add normalized fields and URLs
        df_unique['type_normalized'] = df_unique['type'].apply(self.normalize_college_type) if 'type' in df_unique.columns else 'Unknown'
        df_unique['college_url'] = df_unique['college_code'].map(self.college_urls)
        
        return df_unique.to_dict('records')
    
    # ============================================================================
    # COMPARISON METHODS
    # ============================================================================
    
    def compare_colleges(self, college_codes: List[str], branch: str, 
                        category: str) -> Dict[str, List[Dict]]:
        """
        Compare multiple colleges for specific branch and category
        
        Args:
            college_codes: List of college codes to compare
            branch: Branch name (will be normalized)
            category: Category code (will be uppercased)
        
        Returns:
            Dictionary mapping college_code to list of year data
        """
        comparison_data = {}
        
        print(f"\n🔍 Comparing {len(college_codes)} colleges")
        print(f"   Branch: {branch} → {self.normalize_branch(branch)}")
        print(f"   Category: {category}")
        
        for college_code in college_codes:
            # Ensure college_code is string
            college_code = str(college_code).strip()
            data = self.get_college_data(college_code, branch, category)
            comparison_data[college_code] = data
            
            print(f"   {college_code}: {len(data)} years of data")
            if data:
                years = [d['year'] for d in data]
                print(f"      Years: {', '.join(years)}")
        
        return comparison_data
    
    def get_available_branches(self, college_codes: List[str] = None) -> List[str]:
        """
        Get all available branches, optionally filtered by college codes
        
        Args:
            college_codes: Optional list of college codes to filter branches
        
        Returns:
            List of available branch names
        """
        df = self.merged_data if not self.merged_data.empty else self.individual_data
        
        if df.empty:
            return []
        
        # Filter by college codes if provided
        if college_codes:
            college_codes = [str(c).strip() for c in college_codes]
            df = df[df['college_code'].isin(college_codes)]
        
        # Get unique branches
        branches = df['branch_name'].dropna().unique().tolist()
        
        return sorted(branches)
    
    def get_available_categories(self, college_codes: List[str] = None, branch: str = None) -> List[str]:
        """
        Get all available category codes, optionally filtered by college codes and branch
        
        Args:
            college_codes: Optional list of college codes
            branch: Optional branch name
        
        Returns:
            List of category codes
        """
        df = self.merged_data if not self.merged_data.empty else self.individual_data
        
        if df.empty:
            return []
        
        # Filter by college codes if provided
        if college_codes:
            college_codes = [str(c).strip() for c in college_codes]
            df = df[df['college_code'].isin(college_codes)]
        
        # Filter by branch if provided
        if branch:
            branch_normalized = self.normalize_branch(branch)
            branch_mask = (
                (df['branch_name'].str.lower() == branch.lower()) |
                (df['branch_name'].apply(self.normalize_branch) == branch_normalized)
            )
            df = df[branch_mask]
        
        return sorted(df['category'].dropna().unique().tolist())
    
    def get_available_cities(self) -> List[str]:
        """Get all available cities"""
        df = self.merged_data if not self.merged_data.empty else self.individual_data
        
        if df.empty:
            return []
        
        return sorted(df['city'].dropna().unique().tolist())
    
    def get_college_types(self) -> List[str]:
        """Get normalized college types"""
        return sorted(list(self.COLLEGE_TYPE_GROUPS.keys()))
    
    def get_category_display_name(self, category_code: str) -> str:
        """Get display name for category code"""
        group = self.normalize_category(category_code)
        if group in self.CATEGORY_GROUPS:
            return self.CATEGORY_GROUPS[group]['display_name']
        return category_code
    
    def get_category_description(self, category_code: str) -> str:
        """Get description for category code"""
        group = self.normalize_category(category_code)
        if group in self.CATEGORY_GROUPS:
            return self.CATEGORY_GROUPS[group]['description']
        return ''
    
    # ============================================================================
    # STATISTICS & ANALYSIS
    # ============================================================================
    
    def get_college_stats(self, college_code: str) -> Dict:
        """Get comprehensive statistics for a college"""
        df = self.merged_data if not self.merged_data.empty else self.individual_data
        
        if df.empty:
            return {}
        
        college_code = str(college_code).strip()
        df_college = df[df['college_code'] == college_code]
        
        if len(df_college) == 0:
            return {}
        
        # Get latest record for basic info
        latest = df_college.sort_values('year', ascending=False).iloc[0]
        
        stats = {
            'college_code': college_code,
            'college_name': latest['college_name'],
            'city': latest['city'],
            'type': latest.get('type', 'Unknown'),
            'type_normalized': self.normalize_college_type(latest.get('type', '')),
            'college_url': self.college_urls.get(college_code, ''),
            
            'total_branches': int(df_college['branch_name'].nunique()),
            'available_branches': df_college['branch_name'].unique().tolist(),
            'available_branches_normalized': list(set(
                df_college['branch_name'].apply(self.normalize_branch).tolist()
            )),
            
            'available_categories': df_college['category'].unique().tolist(),
            'years_of_data': sorted(df_college['year'].unique().tolist()),
            
            'avg_closing_rank': int(df_college['closing_rank'].mean()) if 'closing_rank' in df_college else None,
            'min_closing_rank': int(df_college['closing_rank'].min()) if 'closing_rank' in df_college else None,
            'max_closing_rank': int(df_college['closing_rank'].max()) if 'closing_rank' in df_college else None,
            
            'avg_closing_percentile': float(df_college['closing_percentile'].mean()) if 'closing_percentile' in df_college else None,
        }
        
        return stats
    
    def get_trend_analysis(self, college_code: str, branch: str, category: str) -> Dict:
        """Get trend analysis for specific college-branch-category combination"""
        data = self.get_college_data(college_code, branch, category)
        
        if len(data) < 2:
            return {
                'trend': 'insufficient_data',
                'years_available': len(data),
                'message': 'Need at least 2 years of data for trend analysis'
            }
        
        # Sort by year
        data.sort(key=lambda x: x['year'])
        
        # Calculate rank changes
        ranks = [d.get('closing_rank', 0) for d in data if d.get('closing_rank')]
        
        if len(ranks) < 2:
            return {
                'trend': 'no_rank_data',
                'message': 'No rank data available'
            }
        
        # Calculate trend
        first_rank = ranks[0]
        last_rank = ranks[-1]
        rank_change = last_rank - first_rank
        rank_change_percent = (rank_change / first_rank) * 100 if first_rank > 0 else 0
        
        # Determine trend direction
        if rank_change_percent > 5:
            trend = 'decreasing_competition'  # Rank going up means easier
        elif rank_change_percent < -5:
            trend = 'increasing_competition'  # Rank going down means harder
        else:
            trend = 'stable'
        
        return {
            'trend': trend,
            'years_available': len(data),
            'first_year': data[0]['year'],
            'last_year': data[-1]['year'],
            'first_rank': first_rank,
            'last_rank': last_rank,
            'rank_change': rank_change,
            'rank_change_percent': round(rank_change_percent, 2),
            'all_years_data': data
        }